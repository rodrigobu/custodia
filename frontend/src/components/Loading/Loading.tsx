/**
 * Reusable loading components for the Custodia system.
 * Provides skeleton loaders, spinners, and loading state utilities.
 */

// ---------------------------------------------------------------------------
// Spinner – small inline spinner for buttons and compact areas
// ---------------------------------------------------------------------------
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const spinnerSizes = { sm: "h-3.5 w-3.5", md: "h-5 w-5", lg: "h-8 w-8" };

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <svg
      className={`animate-spin ${spinnerSizes[size]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Skeleton – base shimmer block
// ---------------------------------------------------------------------------
interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full" | "xl" | "2xl";
}

const roundedMap = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

export function Skeleton({ className = "h-4 w-full", rounded = "md" }: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer ${roundedMap[rounded]} ${className}`}
      aria-hidden="true"
    />
  );
}

// ---------------------------------------------------------------------------
// SkeletonCard – mimics a SummaryCard while loading
// ---------------------------------------------------------------------------
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm dark:border-gray-700/40 dark:bg-[#1e293b]">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-8 w-36" rounded="lg" />
          <Skeleton className="h-3 w-44" />
        </div>
        <Skeleton className="h-11 w-11 shrink-0" rounded="xl" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SkeletonTableRow – mimics a table row while loading
// ---------------------------------------------------------------------------
export function SkeletonTableRow() {
  return (
    <tr className="animate-fade-in">
      {/* Vehicle (photo + text) */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 shrink-0" rounded="lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </td>
      {/* Placa */}
      <td className="px-4 py-3.5">
        <Skeleton className="h-4 w-20" />
      </td>
      {/* Assessoria */}
      <td className="px-4 py-3.5">
        <Skeleton className="h-4 w-24" />
      </td>
      {/* Status */}
      <td className="px-4 py-3.5">
        <Skeleton className="h-6 w-24" rounded="full" />
      </td>
      {/* Data */}
      <td className="px-4 py-3.5">
        <Skeleton className="h-4 w-20" />
      </td>
      {/* Cidade */}
      <td className="px-4 py-3.5">
        <Skeleton className="h-4 w-24" />
      </td>
      {/* Valor */}
      <td className="px-4 py-3.5">
        <div className="flex justify-end">
          <Skeleton className="h-4 w-20" />
        </div>
      </td>
      {/* Ações */}
      <td className="px-4 py-3.5">
        <div className="flex justify-end gap-1">
          <Skeleton className="h-7 w-7" rounded="md" />
          <Skeleton className="h-7 w-7" rounded="md" />
        </div>
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// SkeletonHistory – mimics history entries while loading
// ---------------------------------------------------------------------------
export function SkeletonHistory({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-label="Carregando histórico">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-700/50 dark:bg-gray-800/50"
        >
          <Skeleton className="mt-0.5 h-7 w-7 shrink-0" rounded="full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-3">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SkeletonUpload – mimics image upload placeholder while loading
// ---------------------------------------------------------------------------
export function SkeletonUpload() {
  return (
    <div className="flex h-48 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
      <Spinner size="lg" className="text-primary-400 dark:text-primary-500" />
      <div className="mt-3 space-y-1.5 text-center">
        <Skeleton className="mx-auto h-3.5 w-40" />
        <Skeleton className="mx-auto h-3 w-28" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PageLoader – branded full-screen loader for app initialization
// ---------------------------------------------------------------------------
export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo */}
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/25">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          {/* Ping ring */}
          <div className="absolute inset-0 animate-ping rounded-2xl bg-primary-600/20" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Custodia
          </p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Carregando sistema...
          </p>
        </div>
        {/* Loading bar */}
        <div className="h-1 w-48 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div className="loading-bar h-full rounded-full bg-primary-500" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ButtonLoading – renders a button with loading state
// ---------------------------------------------------------------------------
interface ButtonLoadingProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function ButtonLoading({
  loading = false,
  loadingText,
  children,
  disabled,
  className = "",
  ...props
}: ButtonLoadingProps) {
  return (
    <button
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <Spinner size="sm" />
          {loadingText || children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
