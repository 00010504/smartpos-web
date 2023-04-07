import { useEffect, useState } from "react";
import SingleIframe from "@/classes/SingleIframe";

// takes onload parameter
export default function useIframe() {
  const [iframe, setIframe] = useState(null);
  // const [src, setSrc] = useState("");

  useEffect(() => {
    if (!iframe) {
      const iFrame = SingleIframe.getInstance();
      setIframe(iFrame);
    }

    // return () => {
    //   SingleIframe.remove();
    // }
  }, [iframe]);

  // useEffect(() => {
  //   if (iframe) {
  //     iframe.onload = onload.bind(iframe);
  //     console.log("onload and src bound and set");
  //   }
  // }, [iframe, onload]);

  // useEffect(() => {
  //   if (iframe && src) {
  //     iframe.src = src;
  //     console.log("src is set");
  //   }
  // }, [iframe, src]);

  // console.log(iframe);

  // return setSrc;
  return iframe;
}
