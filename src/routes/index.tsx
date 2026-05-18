import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Users,
  User,
  GitBranch,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Flag,
  ArrowDown,
  CircleDot,
  X,
  Workflow,
  Info,
  RotateCcw,
  GripVertical,
  Check,
  ChevronsUpDown,
  Search,
  Power,
  PowerOff,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
});

const people = [
  "Waewta Nammontri (Assistant Retail Audit Section Manager)",
  "Ratchapol Ngaongam (Designer)",
  "Amarin Chueychomsri (Senior Software Engineer)",
  "Umaporn Na lamlieng (VM & Display Department Manager)",
  "Natthakarn Tangpanichdee (Buying and Planning Department Manager)",
  "Dritamna Krijakorn (หัวหน้างานบริหารสินค้าอาวุโส- Jaspal and Misty Mynx)",
  "Nuengnith Deeseekaw (Assistant Area Sales Section Manager)",
  "Rinlapath Woranatpaisarn (Senior Designer - LYN)",
  "Viseth Singhsachathet (Deputy CEO BU1 and BU2)",
  "Kaewta Laemthaisong (Senior HR Supervisor)",
  "Charan Singhsachathet (Chief Executive Officer)",
  "Panatee Choochit (Senior Marketing Supervisor)",
  "Wasurat Unaprom (Creative Section Manager)",
  "Chuanpis Banthap (Accounting Receivable Section Manager)",
  "Praphapan Khantee (หัวหน้างานคลังสินค้าอาวุโส)",
  "Bangon Khadsunthorn (Merchandising Assistant Section Manager)",
  "Sutasinee Intharaksa (Sales Department Manager)",
  "Sasithorn Longban (รองผู้จัดการแผนกเมอร์ชั่นไดซิ่ง-Jaspal Womenswear)",
  "Nisachon Saelao (Senior Sourcing & Production Supervisor)",
  "Piengor Jariyatacha (Home decoration Designer and Development)",
  "Sukanya Sunyeekhan (Designer - CCOO)",
  "Pisak Warjid (Senior Software Engineer)",
  "Phuksa Srisuwan (Assistant Sales Operations Section Manager)",
  "Pimtita Kanchanakunchorn (Marketing Director)",
  "Sakolrath Taecho (Graphic Designer)",
  "Kocharat Phumemek (Senior Sale Administration Supervisor)",
  "Lalitpat Netdee (Senior Merchandising Supervisor)",
  "Patticha Klombanjong (Accounting Section Manager)",
  "Wansiri Kijchon (Senior Technician Supervisor)",
  "Wiyada Kana (QA Department Manager - Factory)",
  "Ornida Kittisuphat (Corporate Leasing Section Manager)",
  "Rattakorn Sittirat (Fashion Designer)",
  "Thamonnat Petchwong (Senior Accounting Payable Supervisor)",
  "Sasicholpin Empraneat (Designer - CPS FOOTWEAR)",
  "Prapaporn Yoosin (Merchandising Assistant Section Manager)",
  "Wantana Boonyapongchai (ผู้จัดการแผนกการเงินตรวจจ่าย)",
  "Supawan Panjuy (Graphic Design Section Manager)",
  "Rungnapa Sudsavat (หัวหน้างานเมอร์ชั่นไดซิ่งอาวุโส-JASPAL WOMENSWEAR)",
  "Vimolnut Khamwatanapunt (Corporate Finance Section Manager)",
  "Naphak Kueakamolsuk (Import - Export Department Manager)",
  "Sirikanda Laosattana (หัวหน้างานพัฒนาผลิตภัณฑ์อาวุโส JASPAL & MISTY MYNX)",
  "Woranan Sarasiri (Senior Payroll Supervisor)",
  "Nuchjaree Jamjan (ผู้จัดการแผนกวางแผนและจัดหาวัตถุดิบ-JASPAL)",
  "Tanawat Klypuing (Designer - JASPAL)",
  "Patthamon Wuttiwaritthichinda (Senior Sales and Merchandise Planning Department Manager)",
  "Patpichar Thammapanon (Senior Fabric Development Supervisor)",
  "Jenjira Theanthong (Senior Area Sales Supervisor)",
  "Tuchapol Naksuk (Senior Non-Merchandise Supervisor)",
  "Nareerat siriwiwatthanakul (Senior Marketing Supervisor)",
  "Amonnat Wutthikhun (Senior Planning Supervisor)",
  "Podchara Sangkhaboon (Planning Department Manager)",
  "Nipon Karpisithyangyun (Textile Design Section Manager)",
  "Jirawan Sang-Akard (Head of Designer - LYN)",
  "Pawarana Wisutthinon (E-Commerce Operations Specialist)",
  "Pitchayapa Pronphrom (Senior Payroll Supervisor)",
  "Suthep Thanombooncharoen (Chief Technology Officer)",
  "Nanteerada Sukampeeranon (Designer)",
  "Jinjutha Sattabongkot (Designer-CPS)",
  "Jitti Promsaka Na sakolnakorn (Designer - JASPAL)",
  "Thanyarat Siripobpirapong (Assistant Sourcing & Product Development Section Manager)",
  "Pimroge Batpantana (E-Commerce Director)",
  "Naphat Sae-jeng (Country Manager – Malaysia)",
  "Benjawan Pongcharoenrith (Senior Internal Control Supervisor)",
  "Jittraphun Thongsakul (ORI Design Manager)",
  "Jittima Kittithanasak (Senior Quality Assurance Department Manager)",
  "Pawarisa Iamsinwattana (Senior Executive Secretary)",
  "Kiddee Sae-Lim (ผู้จัดการฝ่ายขาย-CPS)",
  "Panitsara Hanvilai (Textile Designer)",
  "Marisa Jintananatkij (Senior Graphic Design Supervisor)",
  "Sirirat Lawpraphaipun (Senior Creative Supervisor)",
  "Martusorn Jumpakall (Assistant Marketing Section Manager)",
  "Vasin Jirawutinunt (Head of E-Commerce Delivery)",
  "Kanokporn Suwanklom (Legal Department Manager)",
  "Papolthee Rakphongphairoj (Buying & Planning Section Manager)",
  "Naruenan Chinwongvisarn (Sales Operations Director)",
  "Achavin Suknirunvong (Buying and Planning Department Manager)",
  "Jitanut Kunkitkamchon (Planning Section Manager)",
  "Chintana Pattanapidroe (Head of Project Delivery)",
  "Atjima Boonyakiat (Senior Visual Merchandise Supervisor)",
  "Rasita Kaewlar (Creative and Art Directon Section Manager)",
  "Phatchari Klaipuk (Assistant Sales Analysis Section Manager)",
  "Patsaporn Arsasri (VM & Display Department Manager)",
  "Pattara Boonyarith (รองผู้จัดการฝ่าย-สายการเงิน)",
  "Burutpat Chaowalit (Senior Site Operation Supervisor)",
  "Wicharit Panasan (Senior Finance Supervisor)",
  "Rattagee Piwon (Senior E Commerce Operation Supervisor)",
  "Suvaphat Mokkhavesa (Head of ERP Delivery)",
  "Pornthip Limapimahacharoen (Senior VM Supervisor)",
  "Chonlada Boonma (Assistant Buying Section Manager)",
  "Keerati Bumrungkwan (Head of IT Digital Transformation)",
  "Thitima Jentaweepornkul (International Garment Technician Assistant Manager)",
  "Chananya Takira (Assistant Employee Services Section Manager)",
  "Panadda Punamuang (Sales Department Manager)",
  "Sarawan Sriwitchupong (Senior Marketing Supervisor)",
  "Rukkiet Naknak (Assistant Buying Section Manager)",
  "Krit Singhsachathet (CC-OO General Manager)",
  "Apisit Singhsachathet (CPS / CPS Coffee General Manager)",
  "Petcharat Kanyabal (Sales and Operations Director)",
  "Aran Singhsachathet (Executive Associate, Corporate Finance)",
  "Napaskorn Charoenchim (Store Development Section Manager)",
  "Chananchida Samatri (Payroll Section Manager)",
  "Amornrat Kritsin (รองผู้จัดการฝ่ายแพทเทิร์นและผลิตตัวอย่าง)",
  "Masuama Kamolbutra (Senior Sales and Marketing Director)",
  "Chonlaphat Ratsamlarn (Assistant Sourcing Section Manager)",
  "Treemaporn Kongphon (Senior Stylist Supervisor)",
  "Tipparat Termsuknirundorn (Fabric Development Department Manager)",
  "Anoulith Souphavong Etienne (Merchandising and Buying - Accessories,Home and Lifestyle Director)",
  "Sirathat Soponhataikun (Senior Rewards/Compensation and Benefits Department Manager)",
  "Nuntanit Govitvattana (Senior Bag Designer)",
  "Chonlada Srimueang (Senior Sales Administrative Supervisor)",
  "Salisa Songsiri (Assistant Merchandising Section Manager)",
  "Punnapa Ngamlerd (Assistant Buying Section Manager)",
  "Peerasak Klanhom (CRM DIRECTOR)",
  "Thanaporn Binmayid (Senior Buying Supervisor)",
  "Jiraporn Sutthichairatana (Sourcing and Production Section Manager)",
  "Apiradee Sukchuang (Sales Operations Section Manager)",
  "Wannaporn Vichayanotai (Senior Admin Supervisor)",
  "Tiranat Sounyaem (Assistant Logistics Excellence Section Manager)",
  "Sarinthorn Romwapee (Demand and Supply Department Manager (Sukhumvit))",
  "Jira Jantachote (E-Commerce Marketing Section Manager)",
  "Thanchanid Srimongkol (Senior  Backend Operation Supervisor)",
  "Phornphimon Nuchnang (Accounting Director)",
  "Napassorn Khamkhao (Sourcing & Production Supervisor)",
  "Kunwadee Prombutr (Senior Creative Design Department Manager)",
  "Chutchai Artsing (Senior Warehouse Supervisor - Inbound)",
  "Montira Srijantub (Buying Section Manager)",
  "Paveenavat Panyakhom (Assistant Raw Material & VM Display Warehouse Section Manager)",
  "Jutavadee Eartrakulpaiboon (ผู้จัดการฝ่ายจัดซื้อผ้า-JASPAL & MISTY MYNX)",
  "Pranitra Thunonsiri (Senior Merchandising Supervisor)",
  "Kanlaya Khamsri (Senior Area Sales Supervisor)",
  "Konkanok Sukpoonpon (Marketing Communication Section Manager)",
  "Isra Boonthung (Frontend Operation Manager (Social media))",
  "Chonlada Chusaksaengthong (Assistant Planning Section Manager)",
  "Supparat Taveekitmongkol (Senior Merchandising Supervisor)",
  "Nitchakarn Samanyamadures (Fashion Designer)",
  "Watcharamol Chumnansin (Senior Administration Supervisor)",
  "Beekim Sae-teh (Sales and Operations Director)",
  "Siratchaya Intanin (E-Commerce Sales and Marketing Section Manager)",
  "Suwit Satsau (Display Assistant Section Manager)",
  "Sarayut Kanjunthuk (Senior Textile Designer Supervisor)",
  "Jiraporn Phookhai (Compensation and Benefits Section Manager)",
  "Naphangpan Chartpueak (Designer - CCOO)",
  "Preechaya Nanthanavarangkool (Talent Acquisition Department Manager)",
  "Jattaree Jaruchaijinda (Senior Area Sales Supervisor)",
  "Khevin Singhsachathet (RIR General Manager)",
  "Phornthep Singhsachathet (Board of Directiors)",
  "Kanrawee Thuajob (Marketing Section Manager)",
  "Jaree Lee (Designer - LYN AROUND)",
  "Ornsasiphat Phonpanrat (Designer - LYN)",
  "Saksit Choomchung (Assistant E-Com Technical Solution Section Manager)",
  "Attapoom Ramart (Senior Fabric Development Supervisor)",
  "Jutharat Chanaphaikul (Merchandise Planning Department Manager)",
  "Pitchakarn Thanakulruengdech (Assistant CRM Section Manager)",
  "Uma Rajavejjabhisal (Sales Operations Section Manager)",
  "ANOMA Paleebut (Designer - JASPAL)",
  "Kampanart Chaiwong (Fashion Designer)",
  "Kobtip Apaiwong (Senior Fabric Buying Supervisor)",
  "Nipawan Silpmee (Senior Product Development Supervisor)",
  "Siritorn Thongroong (Assistant Marketing Section Manager)",
  "Achara Sudjavata (Senior Sourcing & Production Supervisor)",
  "Panpatt Chomtharak (E-Commerce Operations Department Manager)",
  "Wittaya Thanomsin (Head of Client Technology)",
  "Pakawat Pooboonterm (Infrastructure Manager)",
  "Pornpan Janpeng (Assistant Planning Section Manager - Production)",
  "Pim Pritsangkul (Senior Marketing Department Manager)",
  "Natchiya Sukontanit (Senior Merchandise Planning and Buying Supervisor)",
  "Apirati Malisorn (Textile Design Section Manager)",
  "Siriwan Palanon (ERP Specialist)",
  "Supang Trongkamonthum (Buying Director)",
  "Ravin Rungswang (Bag Designer)",
  "Cherry Limpisirisant (Senior Product Development Department Manager)",
  "Rawat Maraya (ผู้จัดการฝ่ายแพทเทิร์นและผลิตตัวอย่าง)",
  "Sadhinee Pukahuta (Product Marketing Section Manager)",
  "Watanyou Ruangporncharoen (Designer - CCOO)",
  "Nongnuch Chaiyaruk (Senior Merchandising Supervisor)",
  "Songsita Pouphunthong (Sales Operations Department Manager)",
  "Kritsana Klomphug (Head of IT Operations)",
  "Pattamas Siriprasopsothorn (Designer - JELLY BUNNY)",
  "Donrudee Pathomroswong (Senior Merchandising Supervisor)",
  "Sawitree Poueiam (Assistant Data Coordinator Section Manager)",
  "Namkang Patike (Sourcing Department Manager)",
  "Nutthaya Pakanate (Senior Social Media Supervisor)",
  "Phanasin Thuninjinda (Designer - LYN AROUND)",
  "Amnaj Orapa (General Affairs and Facility Department Manager)",
  "Jiranuch Jitrsujarit (Senior Buying and Planning Supervisor)",
  "Chonnipa Santhip (Garment Technical Department Manager)",
  "Ninnara Boonmee (Senior Planning Supervisor)",
  "Nicharee Neelapong (Assistant E-Commerce site Operation Section Manager)",
  "Praphansilp Minpraphal (Designer - CCOO)",
  "Napat Ponsinlapakul (Learning and Development Section Manager)",
  "Thanyaluk Nuttian (Senior Merchandising Supervisor)",
  "Phantipa Asawarungruengchai (Merchandise Planning Senior Supervisor)",
  "Tanaporn Amaralilit (Senior Sales Director - CPS)",
  "Pracha Boonma (Designer - LYN)",
  "Patjira Settheesombat (Senior Graphic Design Supervisor)",
  "Chollatee Chalassathien (Assistant Warehouse Section Manager - Inbound)",
  "Supranee Kongkittiwong (Assistant Import garments Section Manager)",
  "Kritsanarat Rohitsthira (Head of Designer)",
  "Malika Chawla (Senior Director  - CPS Coffee/Beverage)",
  "Hathaitorn Sirimongkol (Sr.Supervisor Merchandising)",
  "Pannchita Thakulnitiroch (Senior Corporate Communication Supervisor)",
  "Sawitta Wintachai (Marketing Assistant Manager)",
  "Arunothai Chalaroengphan (Head of Designer-CCOO WOMEN FASHION WEAR)",
  "Natthaphon Sampathapakdee (Designer/Art Direction Lead - Jaspal Men)",
  "Thanutporn Ajchariyakulporn (Head of Marketing–CPS)",
  "Keerati Malaiwong (Creative and Art Directon Section Manager)",
  "Boonvipa Anchananan (HRBP Department Manager)",
  "Chonrapat Sopchoke (Designer - CCOO)",
  "Arin Singhsachathet (Executive Associate, E-Commerce)",
  "Kittinant Songrianchai (Senior Support Analyst)",
  "Chetsada Bunchoo (Designer)",
  "Suchada Sungthong (Senior Merchandising Supervisor)",
  "Chayanis Ruangsuk (Senior Business Analyst)",
  "Thanaphon Anukoolkitpanit (Senior Textile Designer Supervisor)",
  "Napat Aramtiantamrong (Buying and Planning Department Manager)",
  "Pakavadee Varintara (CRM Department Manager)",
  "Sitang Saidarasamut (Site Operation Section Manager)",
  "Rattiya Patiphatpatavee (Sales and Digital Marketing Manager)",
  "Parida Uea-Aree (Production Planning and Control Section Manager)",
  "Phojcharapon Phromwong (Graphic Designer)",
  "Khajonsak Joisa (Network and Security Engineer)",
  "Atima Worathongchai (Assistant Compensation and Benefits)",
  "Chokchai Thawatcharaporn (Senior Digital Solution)",
  "Asama Sukboonyasatit (Merchandising Director)",
  "Chatuporn Charoenem (Designer - CPS)",
  "Napassakorn Usaprom (International Logistics Specialist)",
  "Patcharawan Seankum (Senior Textile Designer Supervisor)",
  "Apinya Mahachai (Senior Ecommerce Marketing Supervisor)",
  "Sasinat Chokmingkwan (Financial Planning & Analysis Section Manager)",
  "Sasiwan Patomsasittorn (Senior Merchandising Director)",
  "Jeeratanapash Pongsuriyanun (Senior Store Development Supervisor)",
  "Malaiphan Phamornthai (หัวหน้างานเทคนิคการผลิตอาวุโส-JASPAL)",
  "Vinna Tantanadaecha (Assistant Product Development Section Manager)",
  "Jerdtipa Wattakeecharoen (Buying Section Manager)",
  "Somsri Jongklang (Retail Audit Section Manager)",
  "Thanaporn Yampram (International Accounting Section Manager)",
  "Pheemphat Tiyapisanupaisarn (Ecommerce Director)",
  "Netnapa Songsana (Assistant Sourcing Section Manager)",
  "Nonnapat Tiatrakoon (Senior Planning Department Manager)",
  "Kiatisak Singhsachathet (Board of Directiors)",
  "Pasit Anancharoenporn (Data Engineer II)",
  "Chonlakarn Meesub (Brand Experience and KOL Section Manager)",
  "Sorus Hnukaeo (Sales Operations Section Manager)",
  "Sangduan Saraproong (Merchandising Director)",
  "Randy George Trogler (Sales and Operations Director)",
  "Prajak Seetud (Technical Support II)",
  "Chanya Nuntakul (Assistant Sales Section Manger)",
  "Nunsiras Prutthipiboontham (Assistant Buying Section Manager)",
  "Thanyarat Puckpetchphaisal (Assistant Production Section Manager)",
  "Wanpruksa Phothong (Merchandising Section Manager)",
  "Wisanu Pattanamas (Head of Software Development)",
  "Thanatchaya Dankittikul (Senior Buying Supervisor)",
  "Praewsuda Charoenjunyakul (Senior Trade Finance Supervisor)",
  "Thitikorn Laohaviriyanont (Corporate Finance Section Manager)",
  "Surachai Tayabovorn (Senior Display Supervisor)",
  "Jirayus Yaisamer (Assistant Textile Designer Section Manager)",
  "Suthaporn Teeraprasert (Buying Section Manager)",
  "Visakha Protpakorn (Garments Technical Section Manager)",
  "Apinya Monta (Senior Textile Designer Supervisor)",
  "Kanpipat Arunlugrut (Logistics Excellent Department  Manager)",
  "Nilobol Peampongsan (Assistant Marketing Communication Section Manager)",
  "Varisara Singhsachathet (Assistant Misty Mynx General Manager)",
  "Natthaporn Putthawong (Senior Creative Supervisor)",
  "Surachai Paerueangratana (IT Support Manager)",
  "Panuwat Chubthaisong (Designer - JASPAL)",
  "Pirunya Katevongkote (Buying and Planning Director)",
  "Suchari Banditanukul (Buying Department Manager)",
  "Wittawas Nadee (Art Direction Section Manager)",
  "Thananchai Nantakitphattana (Store Development  Department Manager)",
  "Piyawan Ngaodulyawat (Buying & Planning Departmrnt Manager-CCOO)",
  "Touchanun Klinphoh (Senior Interior Designer Supervisor)",
  "Yotsiri Sinborisut (Assistant E-Commerce Sales and Marketing Section Manager)",
  "Worarath Meekhunsuk (Senior Marketing Supervisor)",
  "Chanida Kijjaborriboon (Assistant Product Development Section Manager)",
  "Sukanya Kerdlap (Designer - JASPAL ACCESSORIES)",
  "Phussadee Tungkajorngoson (Designer - CCOO)",
  "Uratchat Semchan (Senior Graphic Design Supervisor)",
  "Thamatat Liangthamarath (Creative Director)",
  "Sirigan Wongpin (Senior Internal Audit & Compliance Department Manager)",
  "Watinee Paleebut (Designer - RIR)",
  "Warattana Suchitkhiddee (Senior Buying Department Manager)",
  "Visith Singhsachathet (Chairman of Executive Committee)",
  "Sukanya Thabarsa (Designer - LYN)",
  "Suvita Chansrichavala (Design & Creative / Merchandising General Manager)",
  "Hathaimat Buaurai (Assistant Buying and Planning Section Manager)",
  "Aranya Sahasakmontri (Asst. Merchandising Manager- Jaspal & Misty Mynx Accessories)",
  "Luck Yamsaengsung (Chief People Officer)",
  "Ampamanas Vinichbutr (Designer - JASPAL)",
  "Romrujee Chuaiprasit (Disigner - Womenswear)",
  "Chorkaew Lulkanalikitkul (Assistant Textile Designer Section Manager)",
  "Amornrat Yuyen (Senior Import Accounting Supervisor)",
  "Paweena Preechateerakul (Merchandise Planning Department Manager)",
  "Nardsinee In-ngam (Senior Corporate Leasing Supervisor)",
  "Dolpakorn Imsirisuk (Assistant Talent Acquisition Section Manager)",
  "Virarat Aunprasert (Talent Acquisition Department Manager)",
  "Pakamon Srilabut (Senior Sales and Merchandise Planning Supervisor)",
  "Sinsom Jirasamritroek (Sales Department Manager)",
  "Napassorn Lostapornpipit (Senior Textile Designer Supervisor)",
  "Ponlatat Loruthai (Senior Business Planning Department)",
  "Sutita Thitiyuttachai (Sales Department Manager)",
  "Viwat Kamarpirata (Designer - CCOO)",
  "Vilasinee Singhsachathet (Misty Mynx General Manager)",
  "Tiwa Teeranopparat (Head of Designer)",
  "Nichanant Sripratum (Marketing Department Manager)",
  "Porndanai Saenglohaphand (Data Analysis Department Manager)",
  "On-uma Sakthaveekulkit (Logistics Director)",
  "Munchumart Numbenjapol (Head of Designer)",
  "Tanyaluk Boonanek (Inventory Control & Support Department Manager)",
  "Oranuch Pimladda (CRM Data Analytics and Insight Department Manager)",
  "Prisadee Sillapasom (Visual Merchandise Department Manager)",
  "Tanwarat Chaiyana (Senior E Commerce Operation Supervisor)",
  "Jittraporn Ngamkham (Senior Internal Control Support Supervisor)",
  "Sanunphat Namsopith (Senior Production Producer Supervisor)",
  "Akkaravin Sumalu (Fashion Designer)",
  "Nantawan Klaying (หัวหน้างานเมอร์ชั่นไดซิ่งอาวุโส-JASPAL WOMENSWEAR)",
  "Nanaril Bootchaiya (Senior Strategy & Communication Department Manager)",
  "Patiphant Sinmoo (Visual Merchandise & Display Director)",
  "Ampaporn Lueangvilai (Executive Secretary)",
  "Thanat Thupthanachot (Graphic Designer Senior Supervisor)",
  "Pabhada Jiramongkolsuk (Head of Designer)",
  "Aticha Ayasanond (HRBP Section Manager)",
  "Sripai Phenpoo (Senior Sourcing & Production Supervisor)",
  "Rawewan Chaisincharoen (Buying Section Manager)",
  "Karinakorn Prachayakool (Assistant Planning Section Manager)",
  "Thaniya Songserm (Assistant Buying & Planning Section Manager)",
  "Nitchanun Sinsuk (QA Section Manager - International)",
  "Apichit Nanet (Customer Service Department Manager)",
  "Duangporn Chatkrapan (Assistant Garments Sourcing Section Manager)",
  "Phinee Lamkool (Head of People Strategies and Acquisition)",
  "Sasitorn Witoon (Fixed Asset Section Manager)",
  "Picharporn Kietcharoensuk (E-commerce Section Manager)",
  "Namthip Choeichuenjit (Senior Ecommerce Marketing Supervisor)",
  "Phimchanok Warinsathien (Senior Concept Design Supervisor)",
  "Suntaree Neawonng (รองผู้จัดการบัญชีต่างประเทศ)",
  "Orapin Wannapayung (Buying and Sales Planning Department Manager)",
  "Kornkan Karnjanopas (Merchandise planning Department Manager - Import brand)",
  "Kampol Tatiyakavee (Chairman / Independent Directors)",
  "Arisa Wannasri (Planning Section Manager)",
  "AGOSTINO FIUME (Senior Shoes Designer - LYN)",
  "Penpicha Pukaro (Merchandise Planning Senior Supervisor)",
  "Varrinya Leelayuvat (E-Commerce Department Manager)",
  "Jutamas Pairaor (Sales Operations Section Manager)",
  "Nittaya Thaengthong (Software Engineer)",
  "Sukanya Tammaket (Assistant HSE & Facility Section Manager)",
  "Suradech Termsapsiri (Textile Designer)",
  "Pornpimol Intharatu (Senior Product Development Supervisor)",
  "Ruthairat Boonkusol (Senior Corporate Finance and Company Secretary Department Manager)",
  "Warangkana Natpatsarapa (Buying and Planning Department Manager)",
  "Paphinwit Mongkhonkaset (Senior Sales Department Manager)",
  "Mayura Nounnok (Senior Customer Service Supervisor)",
  "Chanchanok Ritdamrongphant (Marketing Assistant Section Manager)",
  "Paphashachon Pattanawong (Senior Merchandising Supervisor)",
  "Auyphorn Sirijaijum (Site Operation Department Manager)",
  "Sukanya Koraviyotin (VM Section Manager)",
  "Praveenjate Boripuntaveenun (Interior Design Department Manager)",
  "Raj Sondhi (Project Manager)",
  "Sudapa Limsupanark (Assistant Buying & Planning Section Manager)",
  "Pitinun Poonsawas (Accounting Section Manager)",
  "Juntima Sirimartpornchai (Senior Sourcing & Production Supervisor)",
  "Parnpairum Varavarn (Sales & Operations Department Manager)",
  "Chanisara Jantarat (Senior Marketing Supervisor)",
  "Atidtaya Sukaphong (Assistant Learning and Development Section Manager)",
  "Chananya Thammawutto (Creative and Art Direction Department Manage)",
  "Wichuda Ninrat na Ayutthaya (Assistant Buying Section Manager)",
  "Tanakrit Na Pompetch (Digital Solution)",
  "Puwanai Chaichompu (Project Manager II)",
  "Supitchaya Bunkuea (Operations Section Manager)",
  "Phurit Sirichaiporn (Designer-Lyn Around & Quinn)",
  "Anthony Clerins (Commercial Director-International Business)",
  "Nutcharat Thaweesuthivesh (Head of Product and Design Management)",
  "Chawich Neamnoi (Senior Project Manager)",
  "Pavin Aimjai (Import - Export Corporate Leasing Sourcing Support Director)",
  "Pacharawan Prateepwattananon (Senior Ecommerce Marketing Supervisor)",
  "Akina Mikami (Marketing Communication Section Manager)",
  "Chawallak Pimpang (Senior Ecommerce Marketing Supervisor)",
  "Tanankit Teppradith (Delivery Section Manager)",
  "Pincha Pilawan (Marketing Department Manager)",
  "Phachara Satitanuchit (Senior Systems Analyst)",
  "Cheryl  Lynne Robinson (Chief Business Officer)",
  "Artitaya Promtaveesit Starling (Buying and Planning Director)",
  "Kanthima Wannarat (Senior Public Relations Supervisor)",
  "Kunkornranat Wessuwan (Assistant E-Com Technical Solution Section Manager)",
  "Vatjanee Siriphong (Designer - LYN AROUND)",
  "Monchya Metasiri (Designer - CCOO)",
  "Chanita Saicheua (Chief Finance Officer)",
  "Pimvara Yuniwat (Senior Textile Designer Supervisor)",
  "Korntita Saothongthong (Senior E-Commerce Operations Supervisor)",
  "Wannee Peeramanchai (Technology Innovation Director)",
  "Jarauporn Mounglak (E-Com Operations & Support Department Manager)",
  "Kasama Chaw-u-thai (Designer - CCOO)",
  "Suthathip Hongsiriwan (Buying Section Manager)",
  "Kan Chandratip (Designer)",
  "Phuncharat Chanthong (Senior HRBP Supervisor)",
  "Kosin Putpim (Assistant Head Designer)",
  "Hatchanok Sakvisedchaikun (Senior Sales Director - CCOO,RIR)",
  "Paopol Munthananuchat (Designer)",
  "Pawarisa Kattiyabute (Senior Area Sales Supervisor)",
  "Chantana Sarisee (Accounting Payable Section Manager)",
  "Kanjana Yamphan (Senior Planning Department Manager)",
  "Natcharuedee Khemthong (Executive Secretary)",
  "Punnasa Dusdeesurapoj (Creative Director)",
  "Wikrom Tiracharas (Head of Designer – RIR Menswear)",
  "Guarboon Chuanboon (Designer)",
  "Pongsatorn Tongyeesun (Senior Marketing Communication Supervisor)",
  "Kullapalee Sirisombutyuenyong (Merchandising Department Manager)",
  "Pakade Krissanat (Senior Marketing Communication Supervisor)",
  "Nalinee Ruangwittayanukul (Public Relations Director)",
  "Yosathep Singhsachathet (Deputy CEO BU3, BU4 (Import Brand) and BU5 (IBU))",
  "Premwadee Soithongkham (Assistant Sourcing & Product Development Section Manager)",
  "DESPINA VAMVOUKLI (Chief Commercial Officer Import Brands & International Business)",
  "Pornthip Singpee (Budgeting and Controlling Department Manager)",
  "Siriwan Banpaburut (Senior Sourcing & Production Supervisor)",
  "Prima Mongkolpradit (Senior Ecommerce Marketing Supervisor)",
  "Sirimart Khamsree (Senior Demand and Supply Department Manager)",
  "Pai Praditniyakul (Senior Graphic Design Supervisor)",
  "Siriluck Kunakornplang (Senior Production Planning and Control Department Manager)",
  "Benjawan Wannasrichan (Senior Safety Supervisor)",
  "Napachr Kaewmee (Fashion Designer)",
  "Narumol Lekawanich (Assistant Designer-Jaspal Women)",
  "Benjawan Keatchai (Assistant Planning Section Manager)",
  "Wiriya Wutthichirakorn (Assistant Buying Section Manager)",
  "Preecha Unanuya (Warehouse Section Manager)",
  "Nuttasit Kanaviwat (QA Section Manager - International)",
  "Tanyakan Kruahongs (Marketing Director – CCOO, RIR)",
  "Rujira Jankokiatthikul (Assistant Buying Section Manager)",
  "Pichitpong Pommarat (Designer - JASPAL)",
  "Roongnapha Songsawat (Internal Operation Control Director)",
  "Wassana Chaipradit (Senior Finance & Accounting Director)",
  "Warittha Chantaphan (Social Media Maketing Section Manager)",
  "Thanes Chaiyakul (Data Engineer II)",
  "Yodchai Orraphanthip (Chief Logistics and Factory Production Officer)",
  "Patinrat Komalanont (Merchandising Director)",
  "Praewpan Patrathiranond (Franchise and Business Development Director)",
  "Attapong Palee (Assistant Costing Section Manager)",
  "Wachiraporn Sequeira (Senior Merchandising Department Manager)",
  "Waris Ratnitipong (Designer - RIR)",
  "Thongchai Phiphatphaisan (Assistant Inventory Control & Support Section Manager)",

];

type Mode = "Single" | "Group";
type RejectionRule = "veto" | "majority" | "approvalOnly";

interface Stage {
  id: number;
  name: string;
  mode: Mode;
  allRequired: boolean;
  requiredCount: number;
  approvers: string[];
  active: boolean;
  rejectionRule: RejectionRule;
}

let nextId = 1;
const newStage = (): Stage => ({
  id: nextId++,
  name: "",
  mode: "Single",
  allRequired: true,
  requiredCount: 1,
  approvers: [""],
  active: true,
  rejectionRule: "veto",
});

interface StageIssue {
  stageId: number;
  index: number;
  message: string;
}

function validate(stages: Stage[]): StageIssue[] {
  const issues: StageIssue[] = [];
  const activeStages = stages.filter((s) => s.active);
  if (activeStages.length === 0) {
    issues.push({
      stageId: -1,
      index: -1,
      message: "At least one stage must be active.",
    });
  }
  stages.forEach((s, i) => {
    if (!s.active) return;
    if (s.approvers.length === 0) {
      issues.push({ stageId: s.id, index: i, message: "No approvers added." });
    }
    if (s.approvers.some((a) => !a)) {
      issues.push({
        stageId: s.id,
        index: i,
        message: "Please specify approver for every slot.",
      });
    }
    const dup = new Set<string>();
    for (const a of s.approvers) {
      if (!a) continue;
      if (dup.has(a)) {
        issues.push({
          stageId: s.id,
          index: i,
          message: "Duplicate approvers in this stage.",
        });
        break;
      }
      dup.add(a);
    }
    if (s.mode === "Group" && !s.allRequired) {
      if (s.requiredCount > s.approvers.length) {
        issues.push({
          stageId: s.id,
          index: i,
          message: `Requires ${s.requiredCount} approvals but only ${s.approvers.length} approver(s) added.`,
        });
      }
      if (s.requiredCount < 1) {
        issues.push({
          stageId: s.id,
          index: i,
          message: "Required approvals must be at least 1.",
        });
      }
    }
    // cross-stage duplicates (only against other active stages, ignore empty)
    s.approvers.forEach((a) => {
      if (!a) return;
      const otherStageIdx = stages.findIndex(
        (other, j) => j !== i && other.active && other.approvers.includes(a),
      );
      if (otherStageIdx !== -1) {
        issues.push({
          stageId: s.id,
          index: i,
          message: `${a} is already used in Stage ${otherStageIdx + 1}.`,
        });
      }
    });
  });
  return issues;
}

const stagePlaceholders = [
  "e.g. Manager Review",
  "e.g. Department Approval",
  "e.g. Finance Sign-off",
  "e.g. Executive Approval",
  "e.g. Final Confirmation",
];

function Index() {
  const [requestName, setRequestName] = useState("");
  const [stages, setStages] = useState<Stage[]>(() => [newStage()]);
  const [showPreview, setShowPreview] = useState(false);
  const [countdown, setCountdown] = useState<Record<number, number>>({});
  const timersRef = useRef<Record<number, ReturnType<typeof setInterval>>>({});

  const issues = useMemo(() => validate(stages), [stages]);
  const issuesByStage = useMemo(() => {
    const m = new Map<number, StageIssue[]>();
    for (const i of issues) {
      const arr = m.get(i.stageId) ?? [];
      arr.push(i);
      m.set(i.stageId, arr);
    }
    return m;
  }, [issues]);
  const isValid = issues.length === 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const updateStage = (id: number, patch: Partial<Stage>) =>
    setStages((s) => s.map((st) => (st.id === id ? { ...st, ...patch } : st)));

  const addStage = () => setStages((s) => [...s, newStage()]);

  const removeStage = (id: number) =>
    setStages((s) => s.filter((st) => st.id !== id));

  const toggleActive = (id: number, active: boolean) =>
    setStages((s) => s.map((st) => (st.id === id ? { ...st, active } : st)));

  const resetAll = () => {
    Object.values(timersRef.current).forEach(clearInterval);
    timersRef.current = {};
    setCountdown({});
    setRequestName("");
    setStages([newStage()]);
    setShowPreview(false);
  };

  const addApprover = (id: number) =>
    setStages((s) =>
      s.map((st) => {
        if (st.id !== id) return st;
        const approvers = [...st.approvers, ""];
        const requiredCount = st.allRequired ? approvers.length : st.requiredCount;
        return { ...st, approvers, requiredCount };
      }),
    );

  const removeApprover = (id: number, idx: number) =>
    setStages((s) =>
      s.map((st) => {
        if (st.id !== id) return st;
        const approvers = st.approvers.filter((_, i) => i !== idx);
        const requiredCount = st.allRequired
          ? approvers.length || 1
          : Math.max(1, Math.min(st.requiredCount, approvers.length || 1));
        return { ...st, approvers, requiredCount };
      }),
    );

  const setApprover = (id: number, idx: number, value: string) =>
    setStages((s) =>
      s.map((st) => {
        if (st.id !== id) return st;
        const approvers = [...st.approvers];
        approvers[idx] = value;
        return { ...st, approvers };
      }),
    );

  const setMode = (id: number, mode: Mode) =>
    setStages((s) =>
      s.map((st) => {
        if (st.id !== id) return st;
        if (mode === "Single") {
          return { ...st, mode, approvers: st.approvers.slice(0, 1) };
        }
        return {
          ...st,
          mode,
          allRequired: true,
          requiredCount: st.approvers.length,
        };
      }),
    );

  const setAllRequired = (id: number, checked: boolean) =>
    setStages((s) =>
      s.map((st) => {
        if (st.id !== id) return st;
        if (checked) {
          return { ...st, allRequired: true, requiredCount: st.approvers.length };
        }
        const suggested = Math.max(1, st.approvers.length - 1);
        return { ...st, allRequired: false, requiredCount: suggested };
      }),
    );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setStages((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return items;
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // Auto-enable "All Required" 3s after a stage becomes effectively-all.
  useEffect(() => {
    stages.forEach((st) => {
      const effectivelyAll =
        st.active &&
        st.mode === "Group" &&
        !st.allRequired &&
        st.approvers.length > 0 &&
        st.requiredCount >= st.approvers.length;

      if (effectivelyAll) {
        if (timersRef.current[st.id]) return;
        setCountdown((c) => ({ ...c, [st.id]: 3 }));
        timersRef.current[st.id] = setInterval(() => {
          setCountdown((c) => {
            const next = (c[st.id] ?? 3) - 1;
            if (next <= 0) {
              clearInterval(timersRef.current[st.id]);
              delete timersRef.current[st.id];
              setStages((prev) =>
                prev.map((p) =>
                  p.id === st.id
                    ? { ...p, allRequired: true, requiredCount: p.approvers.length }
                    : p,
                ),
              );
              const { [st.id]: _omit, ...rest } = c;
              return rest;
            }
            return { ...c, [st.id]: next };
          });
        }, 1000);
      } else if (timersRef.current[st.id]) {
        clearInterval(timersRef.current[st.id]);
        delete timersRef.current[st.id];
        setCountdown((c) => {
          const { [st.id]: _omit, ...rest } = c;
          return rest;
        });
      }
    });
    Object.keys(timersRef.current).forEach((k) => {
      const id = Number(k);
      if (!stages.find((s) => s.id === id)) {
        clearInterval(timersRef.current[id]);
        delete timersRef.current[id];
      }
    });
  }, [stages]);

  useEffect(
    () => () => {
      Object.values(timersRef.current).forEach(clearInterval);
    },
    [],
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-muted/40 to-background pb-32">
      <header className="border-b bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-30">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                Approval Workflow Builder
              </h1>
              <p className="text-xs text-muted-foreground">
                Design multi-stage approval flows
              </p>
            </div>
          </div>
          <Badge variant={isValid ? "default" : "destructive"} className="gap-1">
            {isValid ? (
              <>
                <CheckCircle2 className="h-3 w-3" /> Ready
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3" /> {issues.length} issue
                {issues.length > 1 ? "s" : ""}
              </>
            )}
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-6 sm:px-6 sm:pt-8">
        {/* Request Form Name */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-foreground">
                Request Form Name
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAll}
                className="text-muted-foreground hover:text-destructive"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            </div>
            <Input
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              placeholder="Ex: Development Timeline Evaluation"
              className="h-11 text-base"
            />
          </CardContent>
        </Card>

        {/* Stages */}
        <div className="relative">
          <div
            className="absolute left-5 top-2 bottom-2 w-px bg-border sm:left-6"
            aria-hidden
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={stages.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {stages.map((stage, index) => {
                const usedElsewhere = stages
                  .filter((s) => s.id !== stage.id && s.active)
                  .flatMap((s) => s.approvers)
                  .filter(Boolean);
                const activePosition = stage.active
                  ? stages.slice(0, index + 1).filter((s) => s.active).length
                  : null;
                return (
                  <SortableStageCard
                    key={stage.id}
                    stage={stage}
                    index={index}
                    activePosition={activePosition}
                    total={stages.length}
                    stageIssues={issuesByStage.get(stage.id) ?? []}
                    countdown={countdown[stage.id]}
                    usedElsewhere={usedElsewhere}
                    onUpdate={(p) => updateStage(stage.id, p)}
                    onRemove={() => removeStage(stage.id)}
                    onToggleActive={(a) => toggleActive(stage.id, a)}
                    onSetMode={(m) => setMode(stage.id, m)}
                    onSetAllRequired={(c) => setAllRequired(stage.id, c)}
                    onAddApprover={() => addApprover(stage.id)}
                    onRemoveApprover={(idx) => removeApprover(stage.id, idx)}
                    onSetApprover={(idx, v) => setApprover(stage.id, idx, v)}
                  />
                );
              })}
            </SortableContext>
          </DndContext>

          {/* Ghost add card */}
          <div className="relative pl-14 sm:pl-16">
            <div className="absolute left-0 top-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40 bg-card text-muted-foreground sm:h-12 sm:w-12">
              <Plus className="h-5 w-5" />
            </div>
            <button
              onClick={addStage}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-card/30 px-5 py-8 text-sm font-medium text-muted-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              <Plus className="h-4 w-4 transition group-hover:scale-110" />
              Add Approval Stage
            </button>
          </div>
        </div>

        {showPreview && (
          <PreviewSection
            requestName={requestName}
            stages={stages}
            isValid={isValid}
          />
        )}
      </main>

      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          onClick={() => setShowPreview((v) => !v)}
          disabled={!isValid}
          className="gap-2 rounded-full shadow-lg shadow-primary/25"
        >
          <Eye className="h-4 w-4" />
          {showPreview ? "Hide Preview" : "Preview Workflow"}
        </Button>
      </div>
    </div>
  );
}

interface SortableStageCardProps {
  stage: Stage;
  index: number;
  activePosition: number | null;
  total: number;
  stageIssues: StageIssue[];
  countdown: number | undefined;
  usedElsewhere: string[];
  onUpdate: (patch: Partial<Stage>) => void;
  onRemove: () => void;
  onToggleActive: (active: boolean) => void;
  onSetMode: (m: Mode) => void;
  onSetAllRequired: (c: boolean) => void;
  onAddApprover: () => void;
  onRemoveApprover: (idx: number) => void;
  onSetApprover: (idx: number, v: string) => void;
}

function SortableStageCard({
  stage,
  index,
  activePosition,
  total,
  stageIssues,
  countdown,
  usedElsewhere,
  onUpdate,
  onRemove,
  onToggleActive,
  onSetMode,
  onSetAllRequired,
  onAddApprover,
  onRemoveApprover,
  onSetApprover,
}: SortableStageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasIssue = stageIssues.length > 0;
  const isEffectivelyAll =
    stage.mode === "Group" &&
    !stage.allRequired &&
    stage.requiredCount >= stage.approvers.length;
  const placeholder =
    stagePlaceholders[index % stagePlaceholders.length] ?? "Stage name";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative pl-14 pb-6 sm:pl-16",
        isDragging && "z-20 opacity-90",
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-4 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-card shadow-sm font-semibold sm:h-12 sm:w-12",
          !stage.active
            ? "border-dashed border-muted-foreground/40 text-transparent"
            : hasIssue
              ? "border-destructive text-destructive"
              : "border-primary text-primary",
        )}
        aria-label={
          stage.active
            ? `Stage ${activePosition}`
            : "Skipped stage"
        }
      >
        {stage.active ? activePosition : ""}
      </div>

      <Card
        className={cn(
          "transition-shadow hover:shadow-md",
          hasIssue && stage.active && "border-destructive/50",
          !stage.active && "border-dashed bg-muted/30",
          isDragging && "shadow-xl ring-2 ring-primary/40",
        )}
      >
        <CardContent className={cn("p-4 sm:p-5", !stage.active && "opacity-70")}>
          <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="flex h-8 w-6 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
              aria-label="Drag to reorder"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <Badge
              variant={stage.active ? "secondary" : "outline"}
              className="gap-1"
            >
              <Flag className="h-3 w-3" />
              {stage.active ? `Stage ${activePosition}` : "Skipped"}
            </Badge>
            <Input
              value={stage.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder={placeholder}
              className="order-last h-9 w-full font-medium sm:order-none sm:max-w-xs sm:flex-1"
            />
            <div className="hidden sm:block sm:ml-auto" />
            <label
              className="ml-auto flex cursor-pointer items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 sm:ml-0"
              title={stage.active ? "Stage is active" : "Stage is skipped"}
            >
              {stage.active ? (
                <Power className="h-3.5 w-3.5 text-primary" />
              ) : (
                <PowerOff className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "hidden text-xs font-medium sm:inline",
                  stage.active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {stage.active ? "Active" : "Skipped"}
              </span>
              <Switch
                checked={stage.active}
                onCheckedChange={(c) => onToggleActive(!!c)}
              />
            </label>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={total === 1}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this stage?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {stage.name.trim()
                      ? `"${stage.name.trim()}" will be removed from the workflow.`
                      : "This stage will be removed from the workflow."}{" "}
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onRemove}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Approval Type
              </label>
              <Select
                value={stage.mode}
                onValueChange={(v) => onSetMode(v as Mode)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Single Approver
                    </span>
                  </SelectItem>
                  <SelectItem value="Group">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" /> Group Approval
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {stage.mode === "Group" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Required Approvals
                </label>
                <div className="space-y-2">
                  <div className="flex h-9 items-center gap-3 rounded-md border bg-background px-3">
                    <label className="flex cursor-pointer select-none items-center gap-2 text-sm">
                      <Checkbox
                        checked={stage.allRequired}
                        onCheckedChange={(c) => onSetAllRequired(!!c)}
                      />
                      All Required
                    </label>
                    <span className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                      <input
                        type="number"
                        min={1}
                        max={stage.approvers.length}
                        value={stage.requiredCount}
                        onChange={(e) =>
                          onUpdate({
                            requiredCount: Math.max(
                              1,
                              Number(e.target.value) || 1,
                            ),
                          })
                        }
                        disabled={stage.allRequired}
                        className={cn(
                          "w-16 rounded-md border px-2 py-1 text-center text-sm outline-none transition",
                          stage.allRequired
                            ? "cursor-not-allowed border-muted bg-muted text-muted-foreground"
                            : "border-input bg-background text-foreground focus:ring-1 focus:ring-ring",
                        )}
                      />
                      <span>of {stage.approvers.length}</span>
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Approvers can review in any order. The stage advances once the required number of approvals is met.
                  </p>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Rejection Rule
                    </label>
                    <Select
                      value={stage.rejectionRule}
                      onValueChange={(v) =>
                        onUpdate({ rejectionRule: v as RejectionRule })
                      }
                    >
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="veto">
                          Any rejection vetoes the stage (safest)
                        </SelectItem>
                        <SelectItem value="majority">
                          Wait for majority of responses to decide
                        </SelectItem>
                        <SelectItem value="approvalOnly">
                          First to reach approval threshold wins (ignore rejections)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stage.rejectionRule === "veto" &&
                        "As soon as anyone rejects, the stage fails immediately — even if others have approved."}
                      {stage.rejectionRule === "majority" &&
                        "Wait until more than half of approvers respond, then approve or reject by majority."}
                      {stage.rejectionRule === "approvalOnly" &&
                        "Stage passes the moment the approval count is reached. Rejections are not counted — first response wins."}
                    </p>
                  </div>

                  {isEffectivelyAll && (
                    <div className="flex items-start gap-2 rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                      <Info className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>
                        Requiring {stage.requiredCount} of{" "}
                        {stage.approvers.length} is the same as{" "}
                        <strong>All Required</strong>.{" "}
                        {countdown != null
                          ? `Auto-enabling in ${countdown}s…`
                          : "Switching automatically…"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Approvers */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                Approvers ({stage.approvers.length})
              </label>
              {stage.mode === "Group" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAddApprover}
                  disabled={stage.approvers.length >= people.length}
                >
                  <Plus className="h-4 w-4" /> Add
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {stage.approvers.map((appr, idx) => {
                const taken = [
                  ...stage.approvers.filter((_, i) => i !== idx),
                  ...usedElsewhere,
                ];
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                        appr
                          ? "bg-muted"
                          : "border-2 border-dashed border-destructive/50 text-destructive",
                      )}
                    >
                      {appr ? appr.charAt(0) : "?"}
                    </div>
                    <SearchableSelect
                      value={appr}
                      onChange={(v) => onSetApprover(idx, v)}
                      options={people}
                      disabledOptions={taken}
                      placeholder="Please specify approver"
                      invalid={!appr}
                      className="flex-1"
                    />
                    {stage.mode === "Group" && stage.approvers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onRemoveApprover(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {hasIssue && (
            <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/5 p-3">
              {stageIssues.map((iss, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-destructive"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{iss.message}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface SearchableSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabledOptions?: string[];
  placeholder?: string;
  className?: string;
  invalid?: boolean;
}

function SearchableSelect({
  value,
  onChange,
  options,
  disabledOptions = [],
  placeholder = "Select…",
  className,
  invalid = false,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-9 min-w-0 justify-between gap-2 px-3 font-normal",
            !value && "text-muted-foreground",
            invalid &&
            "border-destructive/60 bg-destructive/5 text-destructive hover:text-destructive",
            className,
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <div className="flex items-center border-b px-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <CommandInput
              placeholder="Search…"
              className="border-0 focus:ring-0"
            />
          </div>
          <CommandList>
            <CommandEmpty>No match found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => {
                const isDisabled = disabledOptions.includes(opt) && opt !== value;
                return (
                  <CommandItem
                    key={opt}
                    value={opt}
                    disabled={isDisabled}
                    onSelect={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === opt ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className={cn(isDisabled && "text-muted-foreground")}>
                      {opt}
                    </span>
                    {isDisabled && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        used
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function PreviewSection({
  requestName,
  stages,
  isValid,
}: {
  requestName: string;
  stages: Stage[];
  isValid: boolean;
}) {
  if (!isValid) return null;
  const title = requestName || "Untitled Request";
  const activeStages = stages.filter((s) => s.active);
  const skippedCount = stages.length - activeStages.length;

  return (
    <Card className="mt-8 sm:mt-10">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Workflow Preview</h2>
          <Badge variant="secondary" className="ml-auto whitespace-nowrap">
            {activeStages.length} active
            {skippedCount > 0 ? ` · ${skippedCount} skipped` : ""}
          </Badge>
        </div>

        <div className="rounded-xl border bg-muted/30 p-3 sm:p-6">
          <MilestoneNode
            icon={<CircleDot className="h-4 w-4" />}
            label="START"
            title={title}
            tone="start"
          />

          {activeStages.map((stage, i) => {
            const required =
              stage.mode === "Single"
                ? 1
                : stage.allRequired
                  ? stage.approvers.length
                  : stage.requiredCount;
            const total = stage.mode === "Single" ? 1 : stage.approvers.length;
            const stageName = stage.name.trim() || `Stage ${i + 1}`;
            return (
              <div key={stage.id}>
                <Connector />
                <div className="rounded-lg border bg-card p-3 shadow-sm sm:p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{stageName}</div>
                      <div className="text-xs text-muted-foreground">
                        Stage {i + 1} of {activeStages.length}
                      </div>
                    </div>
                    <Badge variant="outline" className="gap-1 whitespace-nowrap">
                      {stage.mode === "Single" ? (
                        <>
                          <User className="h-3 w-3" /> Single Approver
                        </>
                      ) : (
                        <>
                          <Users className="h-3 w-3" /> {required}/{total} required
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="space-y-1.5 pl-2 sm:pl-10">
                    {stage.approvers.map((a, idx) => (
                      <div
                        key={idx}
                        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground/90"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary/60" />
                        <span className="min-w-0 break-words">{a}</span>
                        {stage.mode === "Single" && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] whitespace-nowrap"
                          >
                            must approve
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 border-t pt-3 text-xs text-muted-foreground">
                    {stage.mode === "Single"
                      ? `Requires approval from ${stage.approvers[0]} to proceed.`
                      : stage.allRequired
                        ? `All ${total} approvers must approve to proceed.`
                        : `Any ${required} of ${total} approvers must approve. Approval order does not matter.`}
                  </div>
                </div>
              </div>
            );
          })}

          <Connector />
          <MilestoneNode
            icon={<Flag className="h-4 w-4" />}
            label="END"
            title="Request Approved"
            tone="end"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MilestoneNode({
  icon,
  label,
  title,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  tone: "start" | "end";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border-2 px-4 py-3",
        tone === "start"
          ? "border-primary/40 bg-primary/5"
          : "border-emerald-500/40 bg-emerald-500/5",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full text-white",
          tone === "start" ? "bg-primary" : "bg-emerald-600",
        )}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="font-semibold">{title}</div>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center py-2">
      <ArrowDown className="h-5 w-5 text-muted-foreground/50" />
    </div>
  );
}
