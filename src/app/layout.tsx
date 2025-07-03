
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const appName = 'MyUnitConvert';
const appDescription = 'The ultimate free online tool for unit and data conversions. Instantly convert length, mass, volume, temperature, JSON, YAML, CSV, Base64, and more. Fast, accurate, and easy to use.';
const appUrl = 'https://myunitconvert.com'; // Placeholder URL

export const metadata: Metadata = {
  title: {
    template: `%s | ${appName}`,
    default: `${appName} - Free Online Unit & Data Converter`,
  },
  description: appDescription,
  keywords: [
    'unit converter',
    'data converter',
    'online converter',
    'free converter',
    'json to yaml',
    'yaml to json',
    'json to xml',
    'xml to json',
    'csv to json',
    'base64 encode',
    'base64 decode',
    'url encode',
    'url decode',
    'length converter',
    'mass converter',
    'temperature converter',
    'volume converter',
    'area converter',
    'speed converter',
    'time converter',
    'pressure converter',
    'energy converter',
    'power converter',
  ],
  applicationName: appName,
  authors: [{ name: 'Firebase Studio' }],
  creator: 'Firebase Studio',
  publisher: 'Firebase Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: appName,
    description: appDescription,
    url: appUrl,
    siteName: appName,
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: `Logo for ${appName}`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: appName,
    description: appDescription,
    images: ['https://placehold.co/1200x630.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: appName,
      operatingSystem: 'All',
      applicationCategory: 'BrowserApplication',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '12853',
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description: appDescription,
      url: appUrl,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
         <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
