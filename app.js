

const API_URL = "https://api.punkapi.com/v2/beers/random";
const API_URL_PUSH = "https://api.punkapi.com/v2/beers";

//tabs
const tabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll('[data-tab-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget)
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active')
        })
        target.classList.add('active')
    })
})

document.addEventListener("DOMContentLoaded", () => {
  const grabBeerBtn = document.querySelector(".beerton");
  const randomBeer = document.querySelector(".randomizer");
  const descDisplay = document.querySelector(".desc");
  const infoBeerTab = document.querySelector(".infoBeer");
  const alcLevel = document.querySelector(".alcShow");
  const historyCards = document.querySelector(".beer-list");



  function getBeer(e) {
    e.preventDefault();
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const name = data[0].name;
        const description = data[0].description;
        const { volume } = data[0];
        const volumeValue = volume.value;
        const volumeUnit = volume.unit;
        const { method } = data[0];
        const methodTemp = method.mash_temp;
        const methodTwist = method.twist;
        const alc = data[0].abv;

        randomBeer.innerHTML = name + " " + volumeValue + " " + volumeUnit;
        descDisplay.innerHTML = description;
        infoBeerTab.innerHTML = methodTwist;
        alcLevel.innerHTML = alc + "%";
        alcLevel.style.display = "block";
        infoBeerTab.style.display = "block";
      });
  }

  grabBeerBtn.addEventListener("click", getBeer);

  //hamburger

  const menu_btn = document.querySelector(".hamburger");
  const mobile_menu = document.querySelector(".mobile-nav");

  menu_btn.addEventListener("click", function () {
    menu_btn.classList.toggle("is-active");
    mobile_menu.classList.toggle("is-active");
  });

  //sticky hamby

  window.addEventListener("scroll", function () {
    let patty = document.querySelector(".hamburger");
    patty.classList.toggle("sticky", window.scrollY > 0);
  });

  //chart m1
  const yearArrX = [];
  const monthArrY = [];
  const alchArrR = [];
  const nameArr = [];

  beerChart();

  async function beerChart() {
    await beerForChart();
    const ctx = document.getElementById("chart");
    const myChart = new Chart(ctx, {
      type: "scatter",
      options: {
        scales: {
          x: {
            type: "time",
            time: {
              unit: "year",
            },
          },
        },
      },
      data: {
        labels: yearArrX,
        datasets: [
          {
            label: "Year Established",
            data: monthArrY,
            backgroundColor: "#0D0D0D",
            borderWidth: 1,
          },
        ],
      },
    });
    }

  async function beerForChart() {
    const response = await fetch(API_URL_PUSH);
    const data = await response.json();

    data.forEach((row) => {

      const tableName = row.name;
      const tableDate = row.first_brewed;
      const dateSplit = tableDate.split("/");
      const tableYear = dateSplit[1];
      const tableMonth = dateSplit[0];
      const tableAlch = row.abv;
      const datapoints = data;

      yearArrX.push(tableYear);
      monthArrY.push(tableMonth);
      alchArrR.push(tableAlch);
      nameArr.push(tableName);

      console.log(tableName);

    })
  }
  // chart m2

  // async function beerForChart() {
  //     const response = await fetch(API_URL_PUSH);
  //     const datapoints = await response.json();
  //     console.log(datapoints);

  //     return datapoints; //
  // }

  // beerForChart().then(datapoints => {

  //   for(var i = 0; i < datapoints.length; i++) {
  //   const year = datapoints[i].first_brewed.map(datapoints[i].name
  //   )
  //   console.log(year);

  //   }
  // });

//beer match
const beerFest = document.getElementById("beerFest");
const beerSearch = document.getElementById("beerSearch");
let dataBM = [];
let slicedFood = [];


console.log(beerSearch);

beerSearch.addEventListener('keyup', (e) => {
  const searchField = e.target.value.toLowerCase();
  const filteredBeer = dataBM.filter((beer) => {
    return (
      beer.name.toString().toLowerCase().includes(searchField) || beer.food_pairing.toString().toLowerCase().includes(searchField)
    );
  });
  beerMenu(filteredBeer);
});


const loadBeers = async () => {

    const res = await fetch(API_URL_PUSH);
    dataBM = await res.json();
    beerMenu(dataBM);

    dataBM.forEach((bottle) => {
      const foodPair = bottle.food_pairing;
      slicedFood = foodPair.slice(',');


    });
    // console.log(dataBM);

};


  const beerMenu = (beers) => {
    const beerCon = beers.map((beer) => {
      return `
      <li class="beer">
        <h2>${beer.name}</h2>
        <p>${beer.food_pairing}</p>
        <img src="${beer.image_url}"></img>
      </li>
      `;
    })
    .join('');
  beerFest.innerHTML = beerCon;
  }

  loadBeers();


});