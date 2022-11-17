import {fetchMovieAvailability,fetchMovieList} from "./api.js";


const mainElement=document.querySelector("main");
const bookerElement=document.querySelector("#booker");
const bookerGridElement=document.querySelector("#booker-grid-holder");
const bookTicketBtn =document.querySelector("#book-ticket-btn");

bookTicketBtn.addEventListener("click" , onBookTicketClickHandler);
let selectedSeats=[];

// task html string to html Dom
const convertToHtmlDom=(htmlInStringFormat) =>{
    const element =document.createElement("div");
    element.innerHTML=htmlInStringFormat;
    return element.firstElementChild;
}
//creat loader
const loader=convertToHtmlDom('<div class="loader">Loading. . . . . . .</div>');
const onseatClick=(event)=>{
    
    event.target.classList.toggle("selected-seat");


    if(event.target.classList.contains("selected-seat")){
        selectedSeats.push(event.target.innerText);
    }
    else{
        selectedSeats=selectedSeats.filter(seat => seat!== event.target.innerText);
    }
    if(selectedSeats.length>0){
        bookTicketBtn.classList.remove("v-none");
    }
    else{
        bookTicketBtn.classList.add("v-none");
    }

   
}


//make agrid of 4*3
const  renderTheatreLayout=( listofUnavilabileseats=[ ], seatnoOffset=1)=>{
    const grid=convertToHtmlDom(`<div class="booking-grid"></div>`);
    // insert grid elements basically theatre seats 
let theatreSeats="";
for(let i=0; i<12; i++){
    theatreSeats=theatreSeats+
    `<div  id="booking-grid-${i+seatnoOffset}"  class=" grid-cell ${listofUnavilabileseats.includes(i+seatnoOffset) ? "unavailabile-seat" : "availabile-seat" }">${i+seatnoOffset}</div>`
}
grid.innerHTML=theatreSeats;

bookerGridElement.appendChild(grid);
document.querySelectorAll(".grid-cell").forEach(cell=>cell.addEventListener("click" , onseatClick));
}
function renderConfirmPurchaseFrom(){
    const form = convertToHtmlDom(`
    <div id="confirm-purchase">
        <h3>Confirm your booking for seat numbers:${selectedSeats.join(",")}</h3>
        <form id="customer-detail-form">
        <div>
            <label for="email_movie">Email: </label>
            <input type="email" id="email_movie" required />
            </div>
            <div>
            <label for="mobile">Phone Number : </label>
            <input type="tel" id="mobile" required />
            </div>
            <button id="movie_submit_btn" type="submit">Purchase</button>
        </form>
    </div>
    `);

    bookerElement.appendChild(form);

    document.querySelector("form").addEventListener("submit", onPurchaseBtnClickHandler);


}

function onBookTicketClickHandler(){
    bookerElement.innerHTML= "";
    renderConfirmPurchaseFrom();
}

const renderMovieTheatre=(event) =>{
event.preventDefault();
    console.log(event.target.innerText);

    const movieName=event.target.innerText ? event.target.innerText  :  event.target.parentElement.innerText ;


    fetchMovieAvailability(movieName).then((listofUnavilableseats)=>{
        console.log(listofUnavilableseats);
        const bookerElementHeader=document.querySelector("#booker h3");
        bookerElementHeader.classList.toggle("v-none");

        renderTheatreLayout(listofUnavilableseats);
        renderTheatreLayout(listofUnavilableseats,13);
    })
}


const renderMoviesList=async()=>{
    mainElement.appendChild(loader);
    const moviesList=await fetchMovieList();
    


    //const movieHolderElement=document.createElement("div");
    //movieHolderElement.classList.add("movie-holder");

    const movieHolderElement=convertToHtmlDom(`<div class="movie-holder"></div>`)//


    moviesList.forEach(movie =>{
        const movieElement= convertToHtmlDom(`<a class="movie- link" href="/${movie.name}">
        <div class="movie" data-id=${movie.name}>
        <div class="movie-img-wrapper" style="background-image: url(${movie.imgUrl}) ; ">
        </div>
        <h4>${movie.name}</h4>
        </div>
        </a> `);
        movieElement.addEventListener("click", renderMovieTheatre);
        movieHolderElement.appendChild(movieElement);
    });
    loader.remove();
    mainElement.appendChild(movieHolderElement)
}


renderMoviesList()
