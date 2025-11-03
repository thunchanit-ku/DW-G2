import { Suspense } from 'react';
import InfoClient from './InfoClient';

export const dynamic = 'force-dynamic'; // กัน SSG เผื่อเพจนี้พึ่งพา query/session

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <InfoClient />
    </Suspense>
  );
}
