import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, User, Mail, ArrowLeft, AlertTriangle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';

const Profile = () => {
  const { user, isAdmin, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      toast.success('You have been signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
      setIsSigningOut(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="space-y-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-primary hover:underline mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            <h1 className="text-4xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Information Card */}
          <Card className="card-elevated">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium mb-1">
                  Email Address
                </p>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{user.email}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium mb-1">
                  Account Created
                </p>
                <p className="text-sm text-foreground">
                  {user.created_at ? formatDate(user.created_at) : 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium mb-1">
                  Last Sign In
                </p>
                <p className="text-sm text-foreground">
                  {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links Card */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Navigate to important sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/order-track')}
              >
                Track Your Orders
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/products')}
              >
                Browse Products
              </Button>
            </CardContent>
          </Card>

          {/* Sign Out Alert */}
          <Alert className="bg-amber-50 border-amber-200 text-amber-900">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              When you sign out, you will need to log in again to access your account.
            </AlertDescription>
          </Alert>

          {/* Sign Out Button */}
          <div className="pt-4">
            <Button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              size="lg"
            >
              {isSigningOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive-foreground mr-2"></div>
                  Signing Out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;
