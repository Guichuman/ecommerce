// auth.ts
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  User,
  getAuth,
  signInWithRedirect
} from "firebase/auth";
import { auth, app } from "../../../firebase";

type SignInResult = {
  user: User | null;
  error: string | null;
};

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

export const signInWithGoogle = async (): Promise<SignInResult> => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app)
  await signInWithPopup(auth, provider);
  return await signInWithProvider(provider);
};

export const signInWithFacebook = async (): Promise<SignInResult> => {
  const provider = new FacebookAuthProvider();
  const auth = getAuth(app)
  await signInWithPopup(auth, provider);
  return await signInWithProvider(provider);
};
