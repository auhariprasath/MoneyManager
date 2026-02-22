import { useEffect, useState } from 'react';
import { userApi } from '@/services/api';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Shield,
    Edit2,
    Save,
    X,
    Bell
} from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
    const [profile, setProfile] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        phoneNumber: '',
        currency: 'INR',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await userApi.getProfile();
            setProfile(response.data);
            setFormData({
                fullName: response.data.fullName || '',
                username: response.data.username,
                email: response.data.email,
                phoneNumber: response.data.phoneNumber || '',
                currency: response.data.currency || 'INR',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await userApi.updateProfile(formData);
            setIsEditing(false);
            fetchProfile();
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-neutral-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-900/50 border border-white/5 p-12">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-purple-500/20">
                                {profile?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                                    Identity <span className="text-primary">Profile</span>
                                </h1>
                                <p className="text-lg text-neutral-400 font-medium">Manage your personal financial identity</p>
                            </div>
                        </div>
                        {!isEditing ? (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 font-bold transition-all shadow-lg shadow-primary/20"
                            >
                                <Edit2 className="mr-2 h-5 w-5" />
                                Edit Profile
                            </Button>
                        ) : (
                            <div className="flex gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsEditing(false)}
                                    className="text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl h-12 px-6 font-bold"
                                >
                                    <X className="mr-2 h-5 w-5" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUpdate}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 px-8 font-bold transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    <Save className="mr-2 h-5 w-5" />
                                    Apply Changes
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <Card className="lg:col-span-2 border-0 bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden">
                        <CardHeader className="p-8 border-b border-white/5">
                            <CardTitle className="text-xl font-bold text-white tracking-tight">Personal Details</CardTitle>
                            <CardDescription className="text-neutral-400">Core identification parameters</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Full Name</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 text-white font-medium"
                                            placeholder="Enter legal name"
                                        />
                                    ) : (
                                        <p className="text-lg font-bold text-white">{profile?.fullName || 'Not specified'}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Username</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 text-white font-medium"
                                        />
                                    ) : (
                                        <p className="text-lg font-bold text-white">{profile?.username}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Email Address</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 text-white font-medium"
                                            type="email"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-bold text-white">{profile?.email}</p>
                                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-black">Verified</Badge>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Phone Number</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 text-white font-medium"
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    ) : (
                                        <p className="text-lg font-bold text-white">{profile?.phoneNumber || 'Not linked'}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Base Currency</Label>
                                    {isEditing ? (
                                        <Select
                                            value={formData.currency}
                                            onValueChange={(val) => setFormData({ ...formData, currency: val })}
                                        >
                                            <SelectTrigger className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 text-white font-medium">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="border-white/5 bg-neutral-800 text-white">
                                                <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                                                <SelectItem value="USD">USD - US Dollar</SelectItem>
                                                <SelectItem value="EUR">EUR - Euro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="text-lg font-bold text-white">{profile?.currency || 'INR'}</p>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Account Meta */}
                    <div className="space-y-6">
                        <Card className="border-0 bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                                <Badge className="bg-primary/20 text-primary border-0 rounded-full px-3 py-1 text-[10px] font-black tracking-widest">ACTIVE SESSION</Badge>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Security Shield</h3>
                            <p className="text-sm font-medium text-neutral-400 mb-6">Account safety and cryptographic integrity status.</p>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-xl">
                                    <span className="text-xs font-bold text-neutral-300">Auth Tier</span>
                                    <span className="text-xs font-black text-white">Standard</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-xl">
                                    <span className="text-xs font-bold text-neutral-300">Risk Profile</span>
                                    <Badge className="bg-emerald-500 text-white border-0 text-[10px] uppercase">{profile?.riskProfile || 'LOW'}</Badge>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-0 bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-amber-500/10 rounded-2xl">
                                    <Bell className="h-6 w-6 text-amber-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Telemetry</h3>
                            <p className="text-sm font-medium text-neutral-400 mb-6">System-wide notification and alert configurations.</p>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="bg-white/5 text-neutral-400 border-white/5 rounded-lg px-3 py-1">Budget Alerts</Badge>
                                <Badge variant="secondary" className="bg-white/5 text-neutral-400 border-white/5 rounded-lg px-3 py-1">Goal Reached</Badge>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
