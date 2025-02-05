"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Facebook, Github } from "lucide-react";

import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  User,
  getAuth,
  signInWithRedirect,
} from "firebase/auth";
import { auth, app } from "../../../firebase";
import { useRouter } from 'next/navigation'

type SignInResult = {
  user: User | null;
  error: string | null;
};

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter()
  const auth = getAuth(app);

const signInWithProvider = async (
  provider: GoogleAuthProvider | FacebookAuthProvider
): Promise<SignInResult> => {
  try {
    const result = await signInWithPopup(auth, provider); 
    return { user: result.user, error: null };
  } catch (error) {
    console.error("Sign-In Error:", error);
    return { user: null, error: (error as Error).message };
  }
};

const handleOAuthLogin = async (provider: "google" | "facebook") => {
  setLoading(true);
  setError(null);

  try {
    const providerInstance =
      provider === "google"
        ? new GoogleAuthProvider()
        : new FacebookAuthProvider();

    const result = await signInWithProvider(providerInstance);

    if (result.error) {
      setError(result.error);
    } else {
      console.log("User logged in:", result.user);
      router.push("/")
      
    }
  } catch (err) {
    setError("Unexpected error occurred. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="**************"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou entre com
              </span>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthLogin("facebook")}
              disabled={loading}
            >
              <Facebook className="mr-2 h-4 w-4" />
              {loading ? "Signing in..." : "Facebook"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthLogin("google")}
              disabled={loading}
            >
              <Github className="mr-2 h-4 w-4" />
              {loading ? "Signing in..." : "Google"}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </CardFooter>
      </Card>
    </div>
  );
}
