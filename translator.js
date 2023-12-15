(function () {
	//copy-paste in console

	//globals
	var from_language = "en";
	var to_language = "it";
	var rapid_api_key = "RAPIDAPI_KEY";

	init(from_language, to_language);

	async function init(from_language, to_language) {
		// Seleziona tutti gli elementi target
		const targetElements = $('.subtitles-menu li:not(.spacing):gt(0)');

		console.log(targetElements);

		// Options for the observer (which mutations to observe)
		const config = { attributes: true, childList: true, subtree: true };

		// Callback function to execute when mutations are observed
		const callback = function (mutationsList, observer) {
			console.log('Callback Triggered');
			for (const mutation of mutationsList) {
				console.log('Mutation Type:', mutation.type);
				console.log('Mutation Target:', mutation.target);
				console.log('Mutation Attributes:', mutation.attributeName, mutation.target.getAttribute(mutation.attributeName));

				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					const element = mutation.target;

					// Check if the "current" class is added
					if (element.classList.contains('current')) {
						// Trigger your custom event or call a function
						translateSubtitles(element);
						console.log('Translating:', element.textContent.trim());
					}
				}
			}
		};

		// Create an observer instance linked to the callback function
		const observer = new MutationObserver(callback);

		// Start observing each target element for configured mutations
		targetElements.each((index, element) => {
			observer.observe(element, config);
		});

		console.log('Observer Initialized');

		translateTexts();

		console.log('Text sent to Translator');


	}

	async function translateSubtitles(element) {

		var text = element.textContent.trim();

		var data = JSON.stringify([
			{
				Text: text
			}
		]);

		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;

		xhr.addEventListener('readystatechange', function () {
			if (this.readyState === this.DONE) {
				var translated = JSON.parse(this.responseText)[0].translations[0].text;
				console.log(translated);
				element.innerHTML = translated + "<br/><span style='color:silver !important;font-size:small !important;'>" + from_language.toUpperCase() + ": " + element.textContent + '</span>';
			}
		});

		xhr.open('POST', 'https://microsoft-translator-text.p.rapidapi.com/translate?api-version=3.0&to%5B0%5D=' + to_language + '&textType=plain&profanityAction=NoAction&from=' + from_language);
		xhr.setRequestHeader('content-type', 'application/json');
		xhr.setRequestHeader('X-RapidAPI-Key', rapid_api_key);
		xhr.setRequestHeader('X-RapidAPI-Host', 'microsoft-translator-text.p.rapidapi.com');

		xhr.send(data);
	}

	async function translateTexts() {
		var elements = $('p');
		elements.each((index, element) => {
			translateSubtitles(element);
		});
	}

})();