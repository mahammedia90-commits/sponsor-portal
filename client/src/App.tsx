import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import DashboardLayout from "./components/DashboardLayout";
import AdminLayout from "./components/AdminLayout";
import { lazy, Suspense } from "react";
import { getLoginUrl } from "./const";

// Lazy-loaded pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const SponsorLogin = lazy(() => import("./pages/SponsorLogin"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Opportunities = lazy(() => import("./pages/Opportunities"));
const Sponsorships = lazy(() => import("./pages/Sponsorships"));
const Contracts = lazy(() => import("./pages/Contracts"));
const Payments = lazy(() => import("./pages/Payments"));
const Leads = lazy(() => import("./pages/Leads"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const BrandExposure = lazy(() => import("./pages/BrandExposure"));
const ROICalculator = lazy(() => import("./pages/ROICalculator"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Messages = lazy(() => import("./pages/Messages"));
const Team = lazy(() => import("./pages/Team"));
const Profile = lazy(() => import("./pages/Profile"));
const Verification = lazy(() => import("./pages/Verification"));
const Help = lazy(() => import("./pages/Help"));
const Notifications = lazy(() => import("./pages/Notifications"));
const AssetMap = lazy(() => import("./pages/AssetMap"));
const PackageCompare = lazy(() => import("./pages/PackageCompare"));
const BrandAssets = lazy(() => import("./pages/BrandAssets"));
const Deliverables = lazy(() => import("./pages/Deliverables"));
const EventCalendar = lazy(() => import("./pages/EventCalendar"));
const PostEventReport = lazy(() => import("./pages/PostEventReport"));
const Networking = lazy(() => import("./pages/Networking"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AdminApprovals = lazy(() => import("./pages/admin/AdminApprovals"));
const AdminSponsors = lazy(() => import("./pages/admin/AdminSponsors"));
const AdminContracts = lazy(() => import("./pages/admin/AdminContracts"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

/* ── Loading Spinner ── */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        </div>
        <p className="text-xs text-muted-foreground animate-pulse">Maham Expo</p>
      </div>
    </div>
  );
}

/* ── Auth Guard: protects dashboard pages using Manus OAuth ── */
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingFallback />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    // Redirect to Manus OAuth login
    window.location.href = getLoginUrl();
    return <LoadingFallback />;
  }

  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Component />
      </Suspense>
    </DashboardLayout>
  );
}

/* ── Admin Guard: protects admin pages, requires role=admin ── */
function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <AdminLayout>
        <LoadingFallback />
      </AdminLayout>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl('/admin');
    return <LoadingFallback />;
  }

  if (user?.role !== 'admin') {
    return <Redirect to="/dashboard" />;
  }

  return (
    <AdminLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Component />
      </Suspense>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Home} />
        <Route path="/login">{() => {
          // Redirect /login to Manus OAuth
          window.location.href = getLoginUrl();
          return <LoadingFallback />;
        }}</Route>

        {/* Protected dashboard routes */}
        <Route path="/dashboard">{() => <ProtectedRoute component={Dashboard} />}</Route>
        <Route path="/opportunities">{() => <Suspense fallback={<LoadingFallback />}><Opportunities /></Suspense>}</Route>
        <Route path="/sponsorships">{() => <ProtectedRoute component={Sponsorships} />}</Route>
        <Route path="/contracts">{() => <ProtectedRoute component={Contracts} />}</Route>
        <Route path="/payments">{() => <ProtectedRoute component={Payments} />}</Route>
        <Route path="/leads">{() => <ProtectedRoute component={Leads} />}</Route>
        <Route path="/analytics">{() => <ProtectedRoute component={Analytics} />}</Route>
        <Route path="/campaigns">{() => <ProtectedRoute component={Campaigns} />}</Route>
        <Route path="/brand-exposure">{() => <ProtectedRoute component={BrandExposure} />}</Route>
        <Route path="/roi-calculator">{() => <ProtectedRoute component={ROICalculator} />}</Route>
        <Route path="/ai-assistant">{() => <ProtectedRoute component={AIAssistant} />}</Route>
        <Route path="/messages">{() => <ProtectedRoute component={Messages} />}</Route>
        <Route path="/team">{() => <ProtectedRoute component={Team} />}</Route>
        <Route path="/profile">{() => <ProtectedRoute component={Profile} />}</Route>
        <Route path="/verification">{() => <ProtectedRoute component={Verification} />}</Route>
        <Route path="/help">{() => <ProtectedRoute component={Help} />}</Route>
        <Route path="/notifications">{() => <ProtectedRoute component={Notifications} />}</Route>
        <Route path="/asset-map">{() => <ProtectedRoute component={AssetMap} />}</Route>
        <Route path="/package-compare">{() => <ProtectedRoute component={PackageCompare} />}</Route>
        <Route path="/brand-assets">{() => <ProtectedRoute component={BrandAssets} />}</Route>
        <Route path="/deliverables">{() => <ProtectedRoute component={Deliverables} />}</Route>
        <Route path="/event-calendar">{() => <ProtectedRoute component={EventCalendar} />}</Route>
        <Route path="/post-event-report">{() => <ProtectedRoute component={PostEventReport} />}</Route>
        <Route path="/networking">{() => <ProtectedRoute component={Networking} />}</Route>

        {/* Admin routes */}
        <Route path="/admin">{() => <AdminRoute component={AdminDashboard} />}</Route>
        <Route path="/admin/events">{() => <AdminRoute component={AdminEvents} />}</Route>
        <Route path="/admin/approvals">{() => <AdminRoute component={AdminApprovals} />}</Route>
        <Route path="/admin/sponsors">{() => <AdminRoute component={AdminSponsors} />}</Route>
        <Route path="/admin/contracts">{() => <AdminRoute component={AdminContracts} />}</Route>
        <Route path="/admin/payments">{() => <AdminRoute component={AdminPayments} />}</Route>
        <Route path="/admin/notifications">{() => <AdminRoute component={AdminNotifications} />}</Route>
        <Route path="/admin/reports">{() => <AdminRoute component={AdminReports} />}</Route>
        <Route path="/admin/settings">{() => <AdminRoute component={AdminSettings} />}</Route>

        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
