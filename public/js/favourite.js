
    document.querySelectorAll(".heart-icon").forEach((heart) => {
      heart.addEventListener("click", async (e) => {
        e.preventDefault();     // stops <a> navigation
        e.stopPropagation();    // stops bubbling to parent <a>
        const listingId = heart.dataset.id;
        console.log("Listing ID:", listingId);

        if (!listingId) {
          alert("Listing ID missing");
          return;
        }

        heart.classList.toggle("active");
        heart.classList.toggle("fa-solid");
        heart.classList.toggle("fa-regular");

        await fetch(`/favourite/${listingId}`, {
          method: "POST",
          credentials: "include"
        });
      });
    });


    
  

 