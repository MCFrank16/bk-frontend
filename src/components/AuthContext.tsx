import { createContext, PropsWithChildren } from 'react'


type AuthProviderProps = PropsWithChildren & {
    user: any
}

export const AuthContext = createContext<any>(null);

const AuthProvider = ({ children, user }: AuthProviderProps) => {

    return (
        <AuthContext.Provider value={{ user }}>
          {children}
        </AuthContext.Provider>
      );
}

export default AuthProvider
