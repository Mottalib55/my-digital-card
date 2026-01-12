import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Eye, UserCheck, TrendingUp, ArrowLeft, ExternalLink,
  Calendar, Mail, User, Shield, RefreshCw, Search, ChevronDown,
  BarChart3, Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, Profile } from "@/lib/supabase";
import SEO from "@/components/SEO";

// Admin emails allowed to access this page
const ADMIN_EMAILS = ["mottalib55@gmail.com", "amradif@gmail.com"].map(e => e.toLowerCase());

interface UserStats {
  totalUsers: number;
  totalViews: number;
  totalContacts: number;
  recentUsers: number; // Last 7 days
}

interface AnalyticsEvent {
  profile_id: string;
  event_type: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, { views: number; contacts: number }>>({});
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    totalViews: 0,
    totalContacts: 0,
    recentUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "views" | "name">("recent");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    // Check if user is admin (case-insensitive)
    const userEmail = (user.email || "").toLowerCase();
    if (!ADMIN_EMAILS.includes(userEmail)) {
      console.log("Access denied for:", userEmail);
      navigate("/dashboard");
      return;
    }

    loadData();
  }, [user, authLoading, navigate]);

  const loadData = async () => {
    setLoading(true);

    // Load all profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Error loading profiles:", profilesError);
    } else if (profilesData) {
      setProfiles(profilesData);

      // Calculate recent users (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentCount = profilesData.filter(
        (p) => new Date(p.created_at) > sevenDaysAgo
      ).length;

      setStats((prev) => ({
        ...prev,
        totalUsers: profilesData.length,
        recentUsers: recentCount,
      }));
    }

    // Load analytics
    const { data: analyticsData, error: analyticsError } = await supabase
      .from("analytics")
      .select("profile_id, event_type, created_at");

    if (analyticsError) {
      console.error("Error loading analytics:", analyticsError);
    } else if (analyticsData) {
      // Group analytics by profile
      const analyticsMap: Record<string, { views: number; contacts: number }> = {};
      let totalViews = 0;
      let totalContacts = 0;

      analyticsData.forEach((event: AnalyticsEvent) => {
        if (!analyticsMap[event.profile_id]) {
          analyticsMap[event.profile_id] = { views: 0, contacts: 0 };
        }
        if (event.event_type === "view") {
          analyticsMap[event.profile_id].views++;
          totalViews++;
        } else if (event.event_type === "contact_saved") {
          analyticsMap[event.profile_id].contacts++;
          totalContacts++;
        }
      });

      setAnalytics(analyticsMap);
      setStats((prev) => ({
        ...prev,
        totalViews,
        totalContacts,
      }));
    }

    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem.`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  };

  // Filter and sort profiles
  const filteredProfiles = profiles
    .filter((profile) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        profile.username?.toLowerCase().includes(searchLower) ||
        profile.first_name?.toLowerCase().includes(searchLower) ||
        profile.last_name?.toLowerCase().includes(searchLower) ||
        profile.email_contact?.toLowerCase().includes(searchLower) ||
        profile.company?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "views") {
        const viewsA = analytics[a.id]?.views || 0;
        const viewsB = analytics[b.id]?.views || 0;
        return viewsB - viewsA;
      }
      if (sortBy === "name") {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      }
      return 0;
    });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user || !ADMIN_EMAILS.includes((user.email || "").toLowerCase())) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <SEO
        title="Admin - 75tools"
        description="Panneau d'administration"
        noindex={true}
      />

      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold text-white">Admin Panel</span>
            </div>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            Actualiser
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 opacity-80" />
              <span className="text-sm opacity-80">Utilisateurs</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
            <p className="text-xs opacity-70 mt-1">+{stats.recentUsers} cette semaine</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 opacity-80" />
              <span className="text-sm opacity-80">Vues totales</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalViews}</p>
            <p className="text-xs opacity-70 mt-1">Sur toutes les cartes</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <UserCheck className="w-5 h-5 opacity-80" />
              <span className="text-sm opacity-80">Contacts sauvés</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalContacts}</p>
            <p className="text-xs opacity-70 mt-1">Téléchargements vCard</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 opacity-80" />
              <span className="text-sm opacity-80">Taux conversion</span>
            </div>
            <p className="text-3xl font-bold">
              {stats.totalViews > 0
                ? `${((stats.totalContacts / stats.totalViews) * 100).toFixed(1)}%`
                : "0%"}
            </p>
            <p className="text-xs opacity-70 mt-1">Vues → Contacts</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="p-4 border-b border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" />
              <h2 className="font-semibold text-white">Utilisateurs inscrits</h2>
              <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-full">
                {filteredProfiles.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "recent" | "views" | "name")}
                  className="appearance-none pl-4 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">Plus récents</option>
                  <option value="views">Plus vus</option>
                  <option value="name">Alphabétique</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                    Entreprise
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                    Inscription
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredProfiles.map((profile) => {
                  const profileAnalytics = analytics[profile.id] || { views: 0, contacts: 0 };
                  return (
                    <tr key={profile.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {profile.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt={profile.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                              {(profile.first_name?.[0] || "").toUpperCase()}
                              {(profile.last_name?.[0] || "").toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-white">
                              {profile.first_name} {profile.last_name}
                            </p>
                            <p className="text-sm text-slate-400">@{profile.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="text-sm">
                          {profile.email_contact && (
                            <p className="text-slate-300 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {profile.email_contact}
                            </p>
                          )}
                          {profile.title && (
                            <p className="text-slate-400 text-xs mt-0.5">{profile.title}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-slate-300 text-sm">
                          {profile.company || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-4">
                          <div className="text-center">
                            <p className="text-white font-medium">{profileAnalytics.views}</p>
                            <p className="text-xs text-slate-400">vues</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white font-medium">{profileAnalytics.contacts}</p>
                            <p className="text-xs text-slate-400">contacts</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1 text-slate-400 text-sm">
                          <Clock className="w-3 h-3" />
                          {getRelativeTime(profile.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => window.open(`/card/${profile.username}`, "_blank")}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                            title="Voir la carte"
                          >
                            <ExternalLink size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredProfiles.length === 0 && (
              <div className="py-12 text-center">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
