import { Suspense } from 'react';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic'; // กัน SSG ถ้าหน้านี้พึ่งพา query/session

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <HomeClient />
    </Suspense>
  );
}
