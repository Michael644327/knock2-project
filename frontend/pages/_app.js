import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/globals.css'
import { AuthContextProvider } from '@/context/auth-context'
import { SnackbarContextProvider } from '@/context/snackbar-context'
import { LoginContextProvider } from '@/context/login-context'
import { DateProvider } from '@/context/date-context'
import { ConfirmDialogProvider } from '@/context/confirm-dialog-context'
import { CartProvider } from '@/context/cart-context'
import { SessionProvider } from '@/context/sessionContext'

export default function MyApp({ Component, pageProps }) {
  // 使用自訂在頁面層級的版面(layout)
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(
    <AuthContextProvider>
      <SnackbarContextProvider>
        <ConfirmDialogProvider>
          <CartProvider>
            <LoginContextProvider>
              <SessionProvider>
                <DateProvider>
                  <Component {...pageProps} />
                </DateProvider>
              </SessionProvider>
            </LoginContextProvider>
          </CartProvider>
        </ConfirmDialogProvider>
      </SnackbarContextProvider>
    </AuthContextProvider>
  )
}
