import { AdminPageHeader } from "@/components/admin-page-header";
import { PostEditor } from "@/components/post-editor";

export default function NewPostPage() {
  return <main><AdminPageHeader title="مقاله جدید" description="نسخه فارسی و انگلیسی مقاله و اطلاعات انتشار را کامل کنید." /><PostEditor /></main>;
}
