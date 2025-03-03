import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (status === "loading") return;
    
    const fetchCurrentUser = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users/${session.user.id}`);
        const data = await response.json();
        
        if (response.ok) {
          setCurrentUser(data);
        } else {
          console.error("ユーザーデータの取得に失敗しました", data);
        }
      } catch (error) {
        console.error("ユーザーデータの取得エラー:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [session, status]);

  return {
    user: currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
  };
};
