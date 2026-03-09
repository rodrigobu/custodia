import time
from collections import defaultdict

from django.http import JsonResponse


class SimpleRateLimitMiddleware:
    """Rate limiting middleware for API endpoints.

    Limits: 60 requests/minute for GET, 20 requests/minute for write operations.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self._requests: dict[str, list[float]] = defaultdict(list)

    def __call__(self, request):
        if not request.path.startswith("/api/"):
            return self.get_response(request)

        ip = self._get_client_ip(request)
        now = time.time()
        window = 60

        rate_limit = 20 if request.method in ("POST", "PUT", "DELETE") else 60

        key = f"{ip}:{request.method}"
        self._requests[key] = [t for t in self._requests[key] if now - t < window]

        if len(self._requests[key]) >= rate_limit:
            return JsonResponse(
                {"detail": "Limite de requisições excedido. Tente novamente em breve."},
                status=429,
            )

        self._requests[key].append(now)
        return self.get_response(request)

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR", "")
