
export const runhtml= async(url,doc)=>{
     if(!url)return {success:false,message:"url missing"}
      try {
      fetch(url)
        .then(res => res.text())
        .then(html => {
         const titleTag = `<title>${doc.name}</title>`;
          const hasTitle = /<title>.*<\/title>/i.test(html);
          
          let modifiedHtml;
          if (hasTitle) {
            modifiedHtml = html.replace(/<title>.*<\/title>/i, titleTag);
          } else if (/<head>/i.test(html)) {
            modifiedHtml = html.replace(/<head>/i, `<head>\n  ${titleTag}`);
          } else {
            modifiedHtml = `<!DOCTYPE html><html><head>${titleTag}</head><body>${html}</body></html>`;
          }
          const blob = new Blob([modifiedHtml], { type: "text/html" });
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, '_blank');
          return {success:true,message:"html running ..."};
        });
    } catch (err) {
      console.error("Error rendering HTML:", err);
      return {success:false,message:err.message}
    }
}