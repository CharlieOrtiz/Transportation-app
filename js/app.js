//VARIABLES
/* Header elements */
const headerSidebar = document.querySelector('.sidebar__menu'); //Sidebar menu
const toggleButton = document.querySelector('.toggle__button');
const navLinks = document.querySelector('.container__nav-links');
const searchButton = document.querySelector('.search__button');
const searchClose = document.querySelector('.search-close__button');
let clickedButtons = []; //Array to storage the actual and last issue buttons clicked
let faqHeight = []; //Array to storage the FAQ container height where json is in.
let ids = []; //Array to storage the subject issue buttons ids
let dropListHelp = []; //Array to storage the drop list arrow in help section

//CLASSES
class UI {
    //Method to show the search bar according to the target that is read (searchType)
    showSearchBar(searchType, placeholder) {
        const searchBar = document.querySelector('.search__container');
        const inputSearch = document.querySelector('.input__search');
        
        if(searchType === 'search') {
            inputSearch.placeholder = placeholder;
        } else if (searchType === 'help') {
            inputSearch.placeholder = placeholder;
        }

        searchBar.classList.add('show__search');
        inputSearch.select();
    }

    //Hide elements that appear with a click
    hideElement(element, className) {
        element.classList.remove(className);
    }

}

/* EVENT LISTENERS */
//Click event in toggle button to open the sidebar:
toggleButton.addEventListener('click', function(){
    const navigation = document.querySelector('.navigation'); //Nav element
    //Creation of the shadow next to the sidebar
    const shadow = document.createElement('div');
    shadow.classList.add('active__shadow');
    //Add class that open the sidebar 
    headerSidebar.classList.add('active__sidebar');
    //Insert the shadow element after the sidebar transition is completed
    setTimeout(function() {
        navigation.insertBefore(shadow, document.querySelector('.header__container'));
    }, 500);
    //Click event in the shadow to remove it and close the sidebar
    shadow.addEventListener('click', function() {
        shadow.remove();
        headerSidebar.classList.remove('active__sidebar');
    })
});

//Click event in search button 
searchButton.addEventListener('click', function() {
    const ui = new UI();
    ui.showSearchBar('search', 'Buscar...');
});

//Click event to close the search bar
searchClose.addEventListener('click', function() {
    const ui = new UI();
    ui.hideElement(searchClose.parentElement, 'show__search');
})

//Click event in every link from the navigation to open the correct landing
navLinks.addEventListener('click', function(e) {
    e.preventDefault();
    const sesionLink = document.getElementById('sesion');
    const indexLink = document.getElementById('index');
    const helpLink = document.getElementById('help');

    const sesionContainer =  document.querySelector('.sesion__container');
    const indexContainer = document.querySelector('.index__container');
    const helpContainer = document.querySelector('.help__container');
    const ui = new UI();
    //Condition to evaluate the link that is being clicked (e.target)
    if(e.target === sesionLink) {
        //Remove the landing showed by the past nav link
        ui.hideElement(document.querySelector('.show__element'), 'show__element');
        //Remove the border and font-weight from the nav link that was clicked before
        ui.hideElement(document.querySelector('.nav__link-clicked'), 'nav__link-clicked');
        //Add the correct classes to show the landing correspondent and the font-weight and border in the link
        sesionLink.classList.add('nav__link-clicked');
        sesionContainer.classList.add('show__element');

    } else if (e.target === indexLink) {
        ui.hideElement(document.querySelector('.show__element'), 'show__element');
        ui.hideElement(document.querySelector('.nav__link-clicked'), 'nav__link-clicked');

        indexLink.classList.add('nav__link-clicked');
        indexContainer.classList.add('show__element');
        
    } else if (e.target === helpLink) {
        ui.hideElement(document.querySelector('.show__element'), 'show__element');
        ui.hideElement(document.querySelector('.nav__link-clicked'), 'nav__link-clicked');

        helpLink.classList.add('nav__link-clicked');
        helpContainer.classList.add('show__element');

        ui.showSearchBar('help', '¿Cómo podemos ayudarte?');
    }
});

//Click event in subject issues buttons
document.querySelector('.help__container').addEventListener('click', function(e) {

    if(e.target.classList.contains('subject-issue__text')) {
        //move the drop list to down
        const dropList = e.target.firstChild;
        dropList.classList.add('drop-down-list__sprite');
        dropListHelp.push(dropList);
        //Storage the sibling of the issue button that has been clicked
        clickedButtons.push(e.target.nextElementSibling);
        const id = e.target.getAttribute('data-id');
        const issueId = parseInt(id); //Actual id button clicked
        //Storage the id from the button
        ids.push(issueId);
        //Create an XML instance
        const xhr = new XMLHttpRequest();
        //Open connection
        xhr.open('GET', 'db/faq.json', true);
        //Procces to onload file in HTML
        xhr.onload = function() {
            if(this.status === 200) {
                const jsonFile = JSON.parse(this.responseText);

                let html = '';
                //for... in to iterate the properties of the jsonFile[issueId] object
                for(quest in jsonFile[issueId]) {
                    html += `<h5>${quest}</h5> 
                             <p>${jsonFile[issueId][quest]}</p>`;
                }
                //Insertion of the requested data in our DOM
                e.target.nextElementSibling.innerHTML = html;
                //If last id button is smaller or equal to the actual id button
                if(ids[0] <= issueId) {
                    //Storage the FAQ height where the json was innered
                    faqHeight.push(e.target.nextElementSibling.offsetHeight);
                }
            }
        } 
        //Send request
        xhr.send(); 
        //If issue buttons that has been clicked are greater than 1
        if(clickedButtons.length > 1) {
            //If last clicked button id is smaller than actual clicked button id
            if(ids[0] < issueId) {
                //Get the height of the FAQ container where the last injection were and the height header
                let topDom = faqHeight[0] + 100;
                //Colocate at the top the correct coordinates (where the last FAQ container is in)
                window.scrollTo({
                    'behavior':'smooth',
                    'left':0,
                    'top': e.target.getBoundingClientRect().top + window.scrollY - topDom
                });
                //Delete now the height of the last FAQ container to open space to the actual FAQ at the index zero
                faqHeight.shift();
            } else {
                //if not just take the height of the header and colocate the button at the top less header
                window.scrollTo({
                    'behavior':'smooth',
                    'left':0,
                    'top':e.target.offsetTop - 90
                });
            }
            //Remove the class that moves our drop list to down
            if(dropListHelp[0] !== dropListHelp[1]) {
                dropListHelp[0].classList.remove('drop-down-list__sprite')
            }
            dropListHelp.shift();
            //Delete injection of the last clicked button
           clickedButtons[0].innerHTML = '';
           //Delete the correspond element in the array
            clickedButtons.shift();
            //Delete the correspond id but in a amount of time to start executing the AJAX procces in the 135 line.
            setTimeout(() => {
                ids.shift();
            }, 100);  
        }

    }
});

const issueTypes = document.querySelectorAll('.subject-issue__text');
const issuesAr = Array.from(issueTypes);

const textIssues = issuesAr.map((issue) => {
    return issue.textContent;
});

document.querySelector('.input__search').addEventListener('keydown', function(e) {
    const inputValue = e.target.value;

    if(inputValue == '') {
        for(let i = 0; i < issueTypes.length; i++) {
            issueTypes[i].parentElement.style.display = 'block';
        }
    } else {

        for(let i = 0; i < issueTypes.length; i++) {
            issueTypes[i].parentElement.style.display = 'none';
        }
    }

    textIssues.forEach((issue, index) => {
        if(issue.indexOf(inputValue) !== -1) {
            issueTypes[index].parentElement.style.display = 'block';
        }
    });

});


