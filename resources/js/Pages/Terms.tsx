import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { FileText, UserX, AlertTriangle, HelpCircle, Scale, Map, Info } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';

export default function Terms() {
    return (
        <MainLayout>
            <Head>
                <title>الشروط والأحكام</title>
                <meta name="description" content="الشروط والأحكام لمنصة المساحة السورية - شروط الاستخدام، السلوك المقبول، وحدود المسؤولية." />
            </Head>

            <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen text-foreground">
                {/* Page Header */}
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex p-3 bg-primary/10 rounded-full text-primary mb-2">
                        <FileText className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">الشروط والأحكام</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
                        آخر تحديث: 26 يوليو 2026
                    </p>
                </div>

                <div className="space-y-6" dir="rtl">
                        <Card className="border-border bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <Scale className="w-5 h-5 text-primary" />
                                    قبول الشروط والاستخدام العام
                                </CardTitle>
                                <CardDescription>شروط تصفح واستخدام منصة المساحة السورية</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                                <p>
                                    من خلال الوصول إلى منصة <strong>المساحة السورية (Syrian Zone)</strong> أو استخدام تطبيق الأندرويد التابع لها، فإنك توافق على الالتزام بهذه الشروط والأحكام بالكامل.
                                </p>
                                <p>
                                    نحن منصة مجتمعية، مفتوحة المصادر، وغير تجارية. جميع الأدوات والخدمات المقدمة مجانية بالكامل وتهدف لمساعدة المجتمع السوري وتسهيل وصوله للمعلومات.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Accounts and Bans */}
                        <Card className="border-border bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <UserX className="w-5 h-5 text-primary" />
                                    حسابات المستخدمين والسلوك المقبول
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                                <p>
                                    عند إنشاء حساب عبر Google OAuth، فإنك توافق على أن تكون المسؤول الوحيد عن استخدام الحساب.
                                </p>
                                <ul className="list-disc list-inside space-y-2 mr-4">
                                    <li><strong>منع التلاعب والتصويت الوهمي:</strong> يمنع منعاً باتاً استخدام برمجيات الروبوت (Bots)، أو الحسابات المتعددة، أو أي نوع من السكربتات لتزييف نتائج التصويت أو تقييمات استطلاعات الرأي.</li>
                                    <li><strong>حظر الحسابات:</strong> تحتفظ المنصة بالحق الكامل في حظر أي مستخدم (`is_banned`) أو عنوان IP يتبين قيامه بأنشطة ضارة مثل محاولات الاختراق، إغراق الخادم بالطلبات (DDoS)، أو نشر محتوى مسيء عبر غرف ألعاب Guess Who أو استوديو الترانزيت.</li>
                                    <li><strong>دقة البيانات:</strong> في حال تقديمك معلومات في دليل الهاتف أو اقتراح مسارات في الترانزيت، يجب أن تكون هذه البيانات صحيحة وواقعية لمساعدة الآخرين.</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Transit Studio Rights */}
                        <Card className="border-border bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <Map className="w-5 h-5 text-primary" />
                                    استوديو الترانزيت وحقوق المساهمة
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                                <p>
                                    تتيح لك ميزة "استوديو الترانزيت" (Transit Studio) المساهمة في رسم وتعديل خطوط النقل والمواقف العامة في المدن السورية.
                                </p>
                                <p>
                                    بإرسالك لمسودة خط نقل أو موقف باص، فإنك تمنح <strong>المساحة السورية</strong> حقاً دائماً، وغير حصري، ومجانياً بالكامل لنشر هذه البيانات، تعديلها، ودمجها مع خرائط المواصلات العامة لتصبح متاحة لكافة المستخدمين تحت رخصة الموارد الحرة والمفتوحة.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Mishwar Directory Rights */}
                        <Card className="border-border bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <Info className="w-5 h-5 text-primary" />
                                    دليل "مشوار" ومساهمات الأماكن والفنادق
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                                <p>
                                    يتيح لك قسم "مشوار" إضافة اقتراحات للأماكن الخدمية والسياحية والفنادق، بالإضافة لتسجيل بيانات المرشدين المحليين في مختلف المحافظات.
                                </p>
                                <p>
                                    يجب أن تكون المحتويات والصور المرفقة دقيقة، لطبقة الاستخدام العام، وخالية من المواد المسيئة أو المخالفة للقوانين. تحتفظ المنصة بالحق الكامل في مراجعة وتعديل أو حذف أي مكان أو مساهمة لا تلتزم بمعايير الدقة والجودة المجتمعية.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Interactive Games (Guess Who) */}
                        <Card className="border-border bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-primary" />
                                    ألعاب الأقران (Guess Who) والاتصالات
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                                <p>
                                    ميزة ألعاب التخمين (Guess Who) تستخدم بروتوكول WebRTC للاتصال الصوتي/المرئي المباشر بين اللاعبين.
                                </p>
                                <p>
                                    يجب على اللاعبين الالتزام بآداب الحوار العام. يمنع منعاً باتاً استخدام ميزة الاتصال المباشر لنقل محتوى يحث على الكراهية، أو التحرش، أو أي محتوى يخالف القوانين العامة. لا نتحمل أي مسؤولية عن تصرفات أو أقوال اللاعبين أثناء الاتصال نظراً لكونه مباشراً ولا يمر عبر خوادمنا.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Limitation of Liability */}
                        <Card className="border-border bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-primary" />
                                    إخلاء المسؤولية وحدودها
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                                <p>
                                    يتم تقديم منصة <strong>المساحة السورية</strong> وأدواتها "كما هي" دون أي ضمانات من أي نوع، صريحة أو ضمنية.
                                </p>
                                <ul className="list-disc list-inside space-y-2 mr-4">
                                    <li><strong>دقة خرائط النقل ودليل الهاتف:</strong> نظراً لأن بيانات الترانزيت ودليل الأرقام تعتمد بشكل كبير على المساهمات المجتمعية والمعلومات الخارجية، فإننا لا نضمن دقة مواعيد باصات النقل أو صحة أرقام الهواتف أو ثبات الأسعار المعروضة.</li>
                                    <li><strong>انقطاع الخدمة:</strong> لا نتحمل المسؤولية عن أي انقطاع مؤقت أو دائم للخدمة أو فقدان للبيانات نتيجة مشاكل تقنية أو أعمال صيانة.</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                <div className="mt-12 text-center text-xs text-muted-foreground">
                    <Separator className="my-6" />
                </div>
            </div>
        </MainLayout>
    );
}
