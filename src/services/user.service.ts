export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export async function getMyProfile(): Promise<CurrentUser> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
}