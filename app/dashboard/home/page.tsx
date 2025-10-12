import { Suspense } from 'react';
import HomeClient from './HomeClient';

<<<<<<< HEAD
export const dynamic = 'force-dynamic'; // กัน SSG ถ้าหน้านี้พึ่งพา query/session
=======
export default function HomePage() {
  const [studentInput, setStudentInput] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [categoryProgress, setCategoryProgress] = useState([]);
  const [headerGpa, setHeaderGpa] = useState<number | null>(null);

  const [result, setResult] = useState({
    email: '',
    fisrtNameEng: '',
    fisrtNameTh: '',
    lastNameTh: '',
    parentTell: '',
    studentId: '',
    studentUsername: '',
    titleTh: '',
    titleEng: '',
    lastNameEng: '',
    faculty: '',
    major: '',
    program: '',
    curriculum: '',
    advisor: '',
    phone: '',
    birthDate: '',
    address: '',
    zipCode: '',
    nameTh: '',
    nameEn: '',
    programType: '',
    programName: ''
  });

  const searchParams = useSearchParams();

  // โหลดข้อมูลจาก sessionStorage ตอน mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedResult = sessionStorage.getItem('studentResult');
      const savedStudent = sessionStorage.getItem('studentInput');
      const savedSelected = sessionStorage.getItem('selectedStudentId');
      const savedGpa = sessionStorage.getItem('headerGpa');
      const savedCategory = sessionStorage.getItem('categoryProgress');

      if (savedResult) setResult(JSON.parse(savedResult));
      if (savedStudent) setStudentInput(savedStudent);
      if (savedSelected) setSelectedStudent(savedSelected);
      if (savedGpa) setHeaderGpa(Number(savedGpa));
      if (savedCategory) setCategoryProgress(JSON.parse(savedCategory));
    }
  }, []);

  useEffect(() => {
    const id =
      searchParams.get('id') ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('selectedStudentId') : null) ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('studentInput') : null) ||
      result?.studentId ||
      '';

    if (id) {
      setStudentInput(id);
      setSelectedStudent(id);
    }
  }, [searchParams, result?.studentId]);

  const fetchCategoryProgress = async (id: string) => {
    try {
      if (!id) {
        setCategoryProgress([]);
        sessionStorage.removeItem('categoryProgress');
        return;
      }
      const res = await fetch(`http://localhost:3002/api/student/category-require/${id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const transformed = data.map((item) => ({
          name: item.SubCategoryName?.trim?.() ?? '',
          mainCategory: item.MainCategoryName?.trim?.() ?? '',
          percent:
            item.TotalCreditRequire && item.TotalCreditRequire !== 0
              ? (item.CreditEarned / item.TotalCreditRequire) * 100
              : 0,
          CreditEarned: item.CreditEarned ?? 0,
          TotalCreditRequire: item.TotalCreditRequire ?? 0,
          gpa: null
        }));
        setCategoryProgress(transformed);
        sessionStorage.setItem('categoryProgress', JSON.stringify(transformed));
      } else {
        setCategoryProgress([]);
        sessionStorage.removeItem('categoryProgress');
      }
    } catch (err) {
      console.error('ไม่สามารถดึงข้อมูลหมวดวิชาได้:', err);
      setCategoryProgress([]);
      sessionStorage.removeItem('categoryProgress');
    }
  };

  const fetchGpa = async (id: string) => {
    try {
      if (!id) {
        setHeaderGpa(null);
        sessionStorage.removeItem('headerGpa');
        return;
      }
      const gpaRes = await fetch(`http://localhost:3002/api/student/grade-progress/${id}`);
      const gpaData = await gpaRes.json();
      if (Array.isArray(gpaData) && gpaData.length > 0) {
        const last = gpaData[gpaData.length - 1];
        const cumulative = last['GPAสะสม'];
        setHeaderGpa(typeof cumulative === 'number' ? cumulative : null);
        sessionStorage.setItem('headerGpa', String(cumulative ?? ''));
      } else {
        setHeaderGpa(null);
        sessionStorage.removeItem('headerGpa');
      }
    } catch (gpaErr) {
      console.log('ไม่สามารถดึงข้อมูล GPA ได้:', gpaErr);
      setHeaderGpa(null);
      sessionStorage.removeItem('headerGpa');
    }
  };

  const handleSubmit = async () => {
    const id = studentInput.trim();
    if (!id) {
      message.error('กรุณากรอกรหัสนิสิต');
      return;
    }

    try {
      const res = await getStudent(id);
      setResult(res);
      setSelectedStudent(id);

      sessionStorage.setItem('studentInput', id);
      sessionStorage.setItem('studentResult', JSON.stringify(res));
      sessionStorage.setItem('selectedStudentId', id);

      await Promise.all([fetchCategoryProgress(id), fetchGpa(id)]);

      window.dispatchEvent(
        new CustomEvent('dw:selected-student-changed', { detail: id })
      );

    } catch (err) {
      console.error(err);
      message.error('ไม่สามารถเรียกข้อมูลได้');
    }
  };
>>>>>>> origin/main

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <HomeClient />
    </Suspense>
  );
}
