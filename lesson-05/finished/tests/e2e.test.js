//@ts-check
const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

const mockData = require('./mock-data.json');
const host = 'http://localhost:3000';
const endpoints = {
    recipes: '/data/recipes?select=_id%2Cname%2Cimg',
    count: '/data/recipes?count',
    recent: '/data/recipes?select=_id%2Cname%2Cimg&sortBy=_createdOn%20desc',
    recipe_by_id: '/data/recipes/3987279d-0ad4-4afb-8ca9-5b256ae3b298',
    register: '/users/register',
    login: '/users/login',
    logout: '/users/logout',
    create: '/data/recipes'
};


function json(data) {
    return {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
}

let browser;
let context;
let page;

describe('E2E tests', function () {
    this.timeout(6000);

    before(async () => {
        // browser = await chromium.launch({ headless: false, slowMo: 500 });
        browser = await chromium.launch();
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();

        // block intensive resources and external calls (page routes take precedence)
        await context.route('**/*.{png,jpg,jpeg}', route => route.abort());
		/*
        await context.route(url => {
            return url.hostname != 'localhost';
        }, route => route.abort());
		*/
        await context.route('**' + endpoints.count, route => route.fulfill(json(3)));

        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    describe('Home', () => {
        it('show most recent recipes', async () => {
            page.route('**' + endpoints.recent, route => route.fulfill(json(mockData.list)));

            await page.goto(host);

            const titles = await page.$$eval('article.recent .recent-title', t => t.map(s => s.textContent));
            expect(titles.length).to.equal(3);
            expect(titles[0]).to.contains('Easy Lasagna');
            expect(titles[1]).to.contains('Grilled Duck Fillet');
            expect(titles[2]).to.contains('Roast Trout');
        });
    });


    describe('Catalog', () => {
        it('loads and renders content from API', async () => {
            page.route('**' + endpoints.recipes + '**', route => route.fulfill(json(mockData.list)));

            await page.goto(host);
            await page.click('text=Catalog');

            const titles = await page.$$eval('article.preview h2', t => t.map(s => s.textContent));
            expect(titles.length).to.equal(3);
            expect(titles[0]).to.contains('Easy Lasagna');
            expect(titles[1]).to.contains('Grilled Duck Fillet');
            expect(titles[2]).to.contains('Roast Trout');
        });

        it('displays recipe details', async () => {
            page.route('**' + endpoints.recipes + '**', route => route.fulfill(json(mockData.list)));
            page.route('**' + endpoints.recipe_by_id, route => route.fulfill(json(mockData.details)));

            await page.goto(host);
            await page.click('text=Easy Lasagna');

            const content = await page.textContent('article');
            expect(content).to.contains('Easy Lasagna');
            expect(content).to.contains('Ingredients');
            expect(content).to.contains('1 tbsp Ingredient 1');
            expect(content).to.contains('Preparation');
            expect(content).to.contains('Prepare ingredients');
        });
    });

    describe('Authentication', () => {
        it('register makes correct API call', async () => {
            const endpoint = '**' + endpoints.register;
            const email = 'john@abv.bg';
            const password = '123456';

            page.route(endpoint, route => route.fulfill(json({ _id: '0001', email, accessToken: 'AAAA' })));

            await page.goto(host);
            await page.click('text=Register');

            await page.waitForSelector('form');

            await page.fill('[name="email"]', email);
            await page.fill('[name="password"]', password);
            await page.fill('[name="rePass"]', password);

            const [response] = await Promise.all([
                page.waitForResponse(endpoint),
                page.click('[type="submit"]')
            ]);

            const postData = JSON.parse(response.request().postData());
            expect(postData.email).to.equal(email);
            expect(postData.password).to.equal(password);
        });

        it('login makes correct API call', async () => {
            const endpoint = '**' + endpoints.login;
            const email = 'john@abv.bg';
            const password = '123456';

            page.route(endpoint, route => route.fulfill(json({ _id: '0001', email, accessToken: 'AAAA' })));

            await page.goto(host);
            await page.click('text=Login');

            await page.waitForSelector('form');

            await page.fill('[name="email"]', email);
            await page.fill('[name="password"]', password);

            const [response] = await Promise.all([
                page.waitForResponse(endpoint),
                page.click('[type="submit"]')
            ]);

            const postData = JSON.parse(response.request().postData());
            expect(postData.email).to.equal(email);
            expect(postData.password).to.equal(password);
        });
    });

    describe('CRUD', () => {
        const email = 'john@abv.bg';
        const password = '123456';


        /* Login user */
        beforeEach(async () => {
            const endpoint = '**' + endpoints.login;

            page.route(endpoint, route => route.fulfill(json({ _id: '0001', email, accessToken: 'AAAA' })));

            await page.goto(host);
            await page.click('text=Login');

            await page.waitForSelector('form');

            await page.fill('[name="email"]', email);
            await page.fill('[name="password"]', password);

            await Promise.all([
                page.waitForResponse(endpoint),
                page.click('[type="submit"]')
            ]);
        });

        it('create makes correct API call for logged in user', async () => {
            const endpoint = '**' + endpoints.create;
            const mock = {
                name: 'Name1',
                img: '/assests/new.png',
                ingredients: ['i1', 'i2'],
                steps: ['s1', 's2'],
                _id: '0002',
                _ownerId: '0001'
            };

            page.route(endpoint, route => route.fulfill(json(mock)));

            await page.click('text=Create Recipe');

            await page.waitForSelector('form');

            await page.fill('[name="name"]', mock.name);
            await page.fill('[name="img"]', mock.img);
            await page.fill('[name="ingredients"]', mock.ingredients.join('\n'));
            await page.fill('[name="steps"]', mock.steps.join('\n'));

            const [response] = await Promise.all([
                page.waitForResponse(endpoint),
                page.click('[type="submit"]')
            ]);

            const postData = JSON.parse(response.request().postData());
            expect(postData.name).to.equal(mock.name);
            expect(postData.img).to.equal(mock.img);
            expect(postData.ingredients).to.deep.equal(mock.ingredients);
            expect(postData.steps).to.deep.equal(mock.steps);
        });

        it('author sees edit and delete buttons', async () => {
            page.route('**' + endpoints.recent, route => route.fulfill(json([mock])));
            const mock = {
                name: 'Name1',
                img: '/assests/new.png',
                ingredients: ['i1', 'i2'],
                steps: ['s1', 's2'],
                _id: '0002',
                _ownerId: '0001'
            };
            page.route('**' + '/recipes/0002', route => route.fulfill(json(mock)));

            await page.goto(host);
            await page.waitForSelector('article');

            await Promise.all([
                page.waitForResponse('**' + '/recipes/0002'),
                page.click('text=Name1')
            ]);

            await page.waitForSelector('article div.controls');

            const buttons = [
                await page.isVisible('button:text("Edit")'),
                await page.isVisible('button:text("Delete")')
            ].every(b => b);
            expect(buttons).to.be.true;
        });

        it('edit loads correct article data for logged in user', async () => {
            page.route('**' + endpoints.recent, route => route.fulfill(json([mock])));
            const mock = {
                name: 'Name1',
                img: '/assests/new.png',
                ingredients: ['i1', 'i2'],
                steps: ['s1', 's2'],
                _id: '0002',
                _ownerId: '0001'
            };
            page.route('**' + '/recipes/0002', route => route.fulfill(json(mock)));

            await page.goto(host);
            await page.click('text=Name1');
            await page.click('button:text("Edit")');

            await page.waitForSelector('form');

            const name = await page.$eval('[name="name"]', e => e.value);
            const img = await page.$eval('[name="img"]', e => e.value);
            const ingredients = await page.$eval('[name="ingredients"]', e => e.value);
            const steps = await page.$eval('[name="steps"]', e => e.value);

            expect(name).to.equal(mock.name);
            expect(img).to.equal(mock.img);
            expect(ingredients).to.equal(mock.ingredients.join('\n'));
            expect(steps).to.equal(mock.steps.join('\n'));
        });

        it('edit makes correct API call for logged in user', async () => {
            page.route('**' + endpoints.recent, route => route.fulfill(json([mock])));
            const mock = {
                name: 'Name1',
                img: '/assests/new.png',
                ingredients: ['i1', 'i2'],
                steps: ['s1', 's2'],
                _id: '0002',
                _ownerId: '0001'
            };
            page.route('**' + '/recipes/0002', route => route.fulfill(json(mock)));

            await page.goto(host);
            await page.click('text=Name1');
            await page.click('button:text("Edit")');

            await page.waitForSelector('form');

            await page.fill('[name="name"]', 'Name2');
            await page.fill('[name="ingredients"]', [...mock.ingredients, 'i3'].join('\n'));
            await page.fill('[name="steps"]', [mock.steps[0]].join('\n'));

            const [response] = await Promise.all([
                page.waitForResponse('**' + '/recipes/0002'),
                page.click('[type="submit"]')
            ]);

            const postData = JSON.parse(response.request().postData());
            expect(postData.name).to.equal('Name2');
            expect(postData.img).to.equal(mock.img);
            expect(postData.ingredients).to.deep.equal([...mock.ingredients, 'i3']);
            expect(postData.steps).to.deep.equal([mock.steps[0]]);
        });

        it('delete makes correct API call for logged in user', async () => {
            page.route('**' + endpoints.recent, route => route.fulfill(json([mock])));
            const mock = {
                name: 'Name1',
                img: '/assests/new.png',
                ingredients: ['i1', 'i2'],
                steps: ['s1', 's2'],
                _id: '0002',
                _ownerId: '0001'
            };
            page.route('**' + '/recipes/0002', route => route.fulfill(json(mock)));

            await page.goto(host);
            await page.click('text=Name1');
            await page.waitForSelector('article');

            page.on('dialog', dialog => dialog.accept());

            const [request] = await Promise.all([
                page.waitForRequest('**' + '/recipes/0002'),
                page.click('button:text("Delete")')
            ]);

            expect(request.method()).to.equal('DELETE');
        });
    });

});
