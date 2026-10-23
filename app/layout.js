import './globals.css';

export const metadata = {
  title: 'Points',
  description: 'Fidelizacion para negocios',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
