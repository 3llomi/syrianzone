import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Shield, Eye, Users, MapPin, Activity, Database, Lock, Globe } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';

export default function Privacy() {
    return (
        <MainLayout>
            <Head>
                <title>سياسة الخصوصية</title>
                <meta name="description" content="سياسة الخصوصية لمنصة المساحة السورية - تعرف على كيفية حماية بياناتك والتقنيات المستخدمة." />
            </Head>

            <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen text-foreground">
                {/* Page Header */}
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex p-3 bg-primary/10 rounded-full text-primary mb-2">
                        <Shield className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">سياسة الخصوصية</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
                        آخر تحديث: 26 يوليو 2026
                    </p>
                </div>

                <div className="space-y-6" dir="rtl">
                        <Card className="border-border bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-primary" />
                                    مقدمة عامة
                                </CardTitle>
                                <CardDescription>لمحة عن الخصوصية في منصة المساحة السورية</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                                <p>
                                    تلتزم منصة <strong>المساحة السورية (Syrian Zone)</strong> بحماية خصوصية مستخدميها. نحن منصة مفتوحة المصادر وغير تجارية، نهدف إلى تقديم أدوات تفاعلية وموارد مفتوحة للشعب السوري.
                                </p>
                                <p>
                                    توضح هذه السياسة نوع البيانات التي نجمعها، وكيفية استخدامها، والتحكم الذي تمتلكه في بياناتك عند استخدام ميزاتنا التفاعلية مثل دليل الأماكن (مشوار)، خرائط النقل (الترانزيت)، نظام التصويت (الاستطلاعات)، وألعاب الأقران (Guess Who).
                                </p>
                            </CardContent>
                        </Card>

                        {/* Account Data & Google OAuth */}
                        <Card className="border-border bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    حسابات المستخدمين والمصادقة (Google OAuth)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                                <p>
                                    لتسهيل مساهمتك في "استوديو الترانزيت" (Transit Studio) وإضافة الأماكن أو الفنادق المحفوظة في "مشوار" (Mishwar)، نتيح تسجيل الدخول الاختياري عبر حساب Google (Google OAuth). لا يتطلب تصفح الموقع أو البحث في الخرائط والاستطلاعات تسجيل الدخول.
                                </p>
                                <ul className="list-disc list-inside space-y-2 mr-4">
                                    <li><strong>البيانات التي نجمعها:</strong> الاسم الكامل، البريد الإلكتروني، معرف جوجل الفريد (Google ID)، ورابط الصورة الشخصية (Avatar URL).</li>
                                    <li><strong>الغرض:</strong> مصادقة الهوية، حفظ أفعالك ومساهماتك الشخصية، وإدارة مسودات النقل والأماكن المقترحة.</li>
                                    <li><strong>حذف الحساب والبيانات:</strong> يمكنك في أي وقت الانتقال إلى <Link href="/dashboard" className="text-primary hover:underline font-semibold">لوحة التحكم</Link> وحذف حسابك بشكل نهائي وفوري. يؤدي ذلك إلى مسح كافة بيانات ملفك الشخصي بالكامل من قاعدة بياناتنا.</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Stored Data */}
                        <Card className="border-border bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <Database className="w-5 h-5 text-primary" />
                                    البيانات التي نقوم بتخزينها
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                                <p>
                                    نقوم بتخزين كمية محدودة جداً من البيانات لضمان تشغيل الخدمات التفاعلية:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                    <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                                        <h4 className="font-bold text-foreground mb-1.5 text-sm">استطلاعات الرأي والتقييمات</h4>
                                        <p className="text-xs">المشاركة في التصويتات لا تتطلب تسجيل الدخول. لحماية النتائج من التكرار، نقوم بتوليد مفتاح تعريف فريد في المتصفح وبصمة مجزأة لعنوان الـ IP بشكل مؤقت دون ربطها بهويتك.</p>
                                    </div>
                                    <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                                        <h4 className="font-bold text-foreground mb-1.5 text-sm">مسودات الترانزيت (Transit Studio)</h4>
                                        <p className="text-xs">عند اقتراح مسارات أو مواقف جديدة، نحفظ المسودة في قاعدة البيانات ليتسنى للمشرفين مراجعتها واعتمادها.</p>
                                    </div>
                                    <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                                        <h4 className="font-bold text-foreground mb-1.5 text-sm">دليل الأماكن (مشوار)</h4>
                                        <p className="text-xs">نحفظ اقتراحات الأماكن والأماكن المحفوظة الخاصة بحسابك، ويتم رفع وتخزين الصور المرفقة بأمان على Cloudflare R2.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Special Features & APIs */}
                        <Card className="border-border bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-primary" />
                                    ميزات خاصة وصلاحيات المتصفح
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                                <p>
                                    تحتوي بعض أجزاء الموقع والتطبيق على ميزات متقدمة تتطلب استخدام أدوات وصلاحيات خاصة:
                                </p>
                                <div className="space-y-4">
                                    <div className="border-r-2 border-primary/50 pr-4">
                                        <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            صلاحيات الموقع الجغرافي (Geolocation API)
                                        </h4>
                                        <p className="text-xs mt-1">
                                            تطلب أقسام "الترانزيت" و"مشوار" صلاحية الوصول لموقعك الجغرافي لعرض موقعك الحالي وحساب الفنادق والمواقف والأماكن القريبة منك. 
                                            <strong className="text-foreground"> لا يتم إرسال أو تخزين إحداثيات موقعك الجغرافي على خوادمنا أبداً</strong>، حيث تتم معالجة بيانات الموقع بالكامل محلياً داخل جهازك.
                                        </p>
                                    </div>

                                    <div className="border-r-2 border-primary/50 pr-4">
                                        <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                                            <Globe className="w-4 h-4 text-primary" />
                                            اتصال الأقران (WebRTC) ولعبة "Guess Who"
                                        </h4>
                                        <p className="text-xs mt-1">
                                            تستخدم لعبة "Guess Who" تقنية WebRTC لربط اللاعبين مباشرة ببعضهم (Peer-to-Peer). نقوم بتشغيل خادم إشارات (Signaling) مؤقت لتنسيق الاتصال فقط. 
                                            بيانات اللعب والاتصال الصوتي/المرئي تعبر مباشرة بين أجهزة اللاعبين ولا يتم تسجيلها أو تمريرها عبر خوادمنا.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Third-Party Tools */}
                        <Card className="border-border bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-primary" />
                                    أدوات الطرف الثالث ومعالجة البيانات
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                                <p>
                                    نستعين ببعض الخدمات الخارجية لتقديم تجربة مستخدم متكاملة:
                                </p>
                                <ul className="list-disc list-inside space-y-2 mr-4">
                                    <li><strong>Google OAuth:</strong> لإدارة تسجيل الدخول الآمن.</li>
                                    <li><strong>Pusher / WebSockets:</strong> لإرسال إشارات الربط اللحظية للاعبي Guess Who وبث التحديثات الفورية.</li>
                                    <li><strong>خرائط MapLibre GL JS و OpenStreetMap:</strong> لتوفير خرائط تفاعلية متجهة في قسمي الترانزيت ومشوار.</li>
                                    <li><strong>تخزين Cloudflare R2:</strong> لتخزين الصور والوسائط الخاصة بالأماكن والهوية البصرية بأمان وسرعة عالية.</li>
                                    <li><strong>بوابة F3alia:</strong> لجلب الفعاليات والأنشطة المحلية.</li>
                                    <li><strong>مواقيت الصلاة (AlAdhan API):</strong> لحساب أوقات الصلاة بدقة بناءً على الموقع الجغرافي المرسل، دون تخزين الإحداثيات على خوادمنا.</li>
                                    <li><strong>تحديد الموقع (GPS / عنوان IP عبر ipwho.is):</strong> عند اختيار التحديد التلقائي للموقع، تُستخدم إحداثيات جهازك أو مدينتك التقريبية من عنوان IP لحساب المواقيت فقط — تبقى على جهازك ولا تُرسل لخوادمنا.</li>
                                    <li><strong>خدمة الطقس (OpenWeather / Cloudflare Workers):</strong> لجلب وعرض حالة الطقس المحلية بناءً على محافظتك أو إحداثياتك التقريبية.</li>
                                    <li><strong>محركات البحث (Google, DuckDuckGo, Bing, SearX):</strong> عند استخدام شريط البحث، يتم توجيه الاستعلام مباشرة إلى المحرك المختار دون تخزينه أو تسجيله من طرفنا.</li>
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
