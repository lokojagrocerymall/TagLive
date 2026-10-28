import { AuthProvider } from './AuthContext'

export const metadata = { 
  title: 'TagLive - Tag Your Live',
  description: 'Tag Your Live - Go Live, Tag Products',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico'
  }
}

export default function RootLayout({children}:{children:any}){
 return (
  <html lang="en">
    <body style={{margin:0,fontFamily:'system-ui',background:'#fff'}}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </body>
  </html>
 )
}
