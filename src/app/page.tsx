import DnDContainer from "@/widgets/DnDContainer";
import { useCookies } from "react-cookie";






export default function Home() {

  const [cookie, setCookie] = useCookies(["access_token", "refresh_token"])

  return (
    <>
      <DnDContainer/>
    </>
  )
}