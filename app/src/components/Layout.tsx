import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Target,
  Lightbulb,
  LogOut,
  Menu,
  User,
  ChevronRight
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Budgets', href: '/budgets', icon: Wallet },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Financial Nexus', href: '/suggestions', icon: Lightbulb },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-neutral-950 selection:bg-primary/20 selection:text-primary">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu */}
            <div className="flex items-center gap-4 md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/10">
                    <Menu className="h-5 w-5 text-slate-300" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] border-r-0 bg-slate-900/95 backdrop-blur-xl p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-8 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-xl">
                          <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">Fin<span className="text-primary">Nexus</span></span>
                      </div>
                    </div>
                    <nav className="flex-1 p-4 space-y-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center justify-between group px-4 py-4 rounded-3xl transition-all duration-300 ${isActive(item.href)
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                            : 'text-slate-300 hover:bg-white/10'
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <item.icon className="h-5 w-5" />
                            <span className="font-bold">{item.name}</span>
                          </div>
                          {!isActive(item.href) && <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-60 transition-all" />}
                        </Link>
                      ))}
                    </nav>
                    <div className="p-8 border-t border-white/10">
                      <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-bold">
                        <LogOut className="h-5 w-5" />
                        Terminate Session
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <div className="p-2 bg-primary rounded-xl">
                <Wallet className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Logo & Desktop Nav */}
            <div className="hidden md:flex items-center gap-12">
              <Link to="/dashboard" className="flex items-center gap-3 group">
                <div className="p-2 bg-primary rounded-xl">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">
                  Fin<span className="text-primary">Nexus</span>
                </span>
              </Link>
              <nav className="flex items-center gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive(item.href) ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
                  >
                    {isActive(item.href) && (
                      <div className="absolute inset-0 bg-primary/10 rounded-lg -z-10" />
                    )}
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Operator</span>
                <span className="text-sm font-bold text-slate-200">{user?.username}</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-11 w-11 rounded-[1.2rem] p-0 overflow-hidden ring-2 ring-purple-500/30 hover:ring-purple-500/50 transition-all">
                    <Avatar className="h-full w-full rounded-none">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-black text-lg">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2 mt-4 bg-slate-900/95 backdrop-blur-xl border-white/20 rounded-[2rem] shadow-2xl shadow-black/50" align="end">
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-2">
                      <Badge className="w-fit bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-0 rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">
                        Standard Account
                      </Badge>
                      <div>
                        <p className="text-sm font-black text-white tracking-tight">{user?.username}</p>
                        <p className="text-xs font-bold text-slate-400">{user?.email}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <div className="p-2 space-y-1">
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-2xl p-3 focus:bg-white/10 cursor-pointer group">
                      <div className="p-2 bg-white/10 rounded-xl mr-3 group-hover:bg-white/20 transition-colors">
                        <User className="h-4 w-4 text-slate-300" />
                      </div>
                      <span className="font-bold text-slate-200">Identity Profile</span>
                    </DropdownMenuItem>

                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <div className="p-2">
                    <DropdownMenuItem onClick={handleLogout} className="rounded-2xl p-3 focus:bg-rose-500/10 cursor-pointer group text-rose-400">
                      <div className="p-2 bg-rose-500/10 rounded-xl mr-3 group-hover:bg-rose-500/20 transition-colors">
                        <LogOut className="h-4 w-4 text-rose-400" />
                      </div>
                      <span className="font-bold">Terminate Session</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
          {children}
        </div>
      </main>


    </div>
  );
};

export default Layout;
