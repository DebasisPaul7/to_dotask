
document.addEventListener("click", function (e) {
    //delete items
    if (e.target.classList.contains("delete-me")) {
        if (confirm("Do you really want to delete??")) {
            axios.post('/delete', { id: e.target.getAttribute("data-id") }).then(function () {
                e.target.parentElement.parentElement.remove()
            }).catch(function () {
                console.log("try after sometime")
            })
        }
    }
    //update item
    if (e.target.classList.contains("edit-me")) {
        let userinput = prompt("Enter the desired value", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        if (userinput) {
            axios.post('/update', { text: userinput, id: e.target.getAttribute("data-id") }).then(function () {
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userinput
            }).catch(function () {
                console.log("try after sometime")
            })
        }
    }
})

