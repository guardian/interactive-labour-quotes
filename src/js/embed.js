import iframeMessenger from 'guardian/iframe-messenger'
import reqwest from 'reqwest'
import embedHTML from './text/embed.html!text'
import mustache from 'mustache'

window.init = function init(el, config) {
    iframeMessenger.enableAutoResize();

    reqwest({
        url: 'https://interactive.guim.co.uk/docsdata-test/1WRy-3vbYVC8aI0I1qDLjvksXXgvt1nsmHLlGwD2rS_A.json',
        type: 'json',
        crossOrigin: true,
        success: (resp) => render(resp, el)
    });
};

function render (resp, el) {
	var data = resp.sheets.Sheet1.filter( (d) => { return d.category !=="" })

	data.forEach(
		(d) => {
			d.result = (d.drop<=0)?"gain":"loss";
			d.drop = (d.drop <= 0)?"+"+(-d.drop):""+(-d.drop);

			console.log(d);
		})

	var cat1 = data.filter( (d) => { return d.party === "Con" });
	var cat2 = data.filter( (d) => { return d.party === "Lab" });
	var cat3 = data.filter( (d) => { return d.party === "UKIP" });
	var cat4 = data.filter( (d) => { return d.party === "SNP" });

	var dataToRender = {
		categories: [
			{ title: resp.sheets.categories[0].title,
			copy: resp.sheets.categories[0].copy,
			constituencies: cat1
			},
			{ title: resp.sheets.categories[1].title,
			copy: resp.sheets.categories[1].copy,
			constituencies: cat2
			},
			{ title: resp.sheets.categories[2].title,
			copy: resp.sheets.categories[2].copy,
			constituencies: cat3
			},
			{ title: resp.sheets.categories[3].title,
			copy: resp.sheets.categories[3].copy,
			constituencies: cat4
			}
		]
	}

	var html = mustache.render(embedHTML, dataToRender);
	el.innerHTML = html;
}