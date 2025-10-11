import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import themeConfig from '@/lib/theme';
import "./globals.css";

const kanit = Kanit({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ["latin", "thai"],
  variable: '--font-kanit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "DW-G2 Project",
  description: "Next.js project with Ant Design, Lucide Icons, and Kanit font",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={kanit.variable}>
        <AntdRegistry>
          <ConfigProvider theme={themeConfig}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

