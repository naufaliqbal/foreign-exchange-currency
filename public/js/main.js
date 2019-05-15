// vue component
Vue.component('v-app-body', {
    props: {
        abbreviations: {
            type: Object,
            required: true
        },
        exchangeratelist: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            selectedCurrency: null,
            add: false,
            addedRate: [],
            selectedNominal: 10,
            mainCurrency: "USD"
        }
    },
    // this template is divided by 2 sections
    // 1. header section => .app-header-wrapper
    // 2. body section => .app-body-wrapper
    template: `
        <div class="app">
            <div class="app-header-wrapper">
                <p class="app-header-wrapper__detail">{{mainCurrency}} - {{currencyAbbr}}</p>
                <div class="app-header-wrapper__input">
                    <select v-model=mainCurrency  @change=getNewExchangeRate>
                        <option v-for="list in exchangeRateListKeys" :value=list>{{list}}</option>
                    </select>
                    <input v-model=selectedNominal min=0 type=number />
                </div>
            </div>

            <div class="app-body-wrapper">
                <div class="app-body-wrapper__currency-lists">
                    <div v-for="(rateList, idx) in addedRate" :key=rateList.currency class="list">
                        <div class="list-information">
                            <div class="list-information-header">
                                <span class="currency">{{rateList.currency}}</span>
                                <span class="value">{{(selectedNominal * rateList.rate).toFixed(2)}}</span>
                            </div>
                            <p class="list-information-abbr">{{rateList.currency}} - {{rateList.abbreviations}}</p>
                            <p class="list-information-exchangerate">1 {{mainCurrency}} = {{rateList.currency}} {{rateList.rate}}</p>
                        </div>
                        <button @click=removeList(idx)>(&#x2212;)</button>
                    </div>
                </div>
                <div class="app-body-wrapper__input-button" v-if="!add">
                    <button @click=showInputCurrencies>(&#x2b;) Add More Currencies</button>
                </div>
                <div class="app-body-wrapper__input-currency" v-if="add">
                    <select v-model="selectedCurrency">
                        <option v-for="list in exchangeRateListKeys" :value=list>{{list}}</option>
                    </select>
                    <button @click=addList>Submit</button>
                </div>
            </div>
        </div>
    `,
    computed: {
        exchangeRateListKeys() {
            return Object.keys(this.exchangeratelist)
        },
        currencyAbbr() {
            return this.abbreviations[this.mainCurrency]
        }
    },
    methods: {
        // add rate to list
        addList() {
            var rate = this.exchangeratelist[this.selectedCurrency]
            this.addedRate.push({
                currency: this.selectedCurrency,
                rate: rate.toFixed(2),
                abbreviations: this.abbreviations[this.selectedCurrency]
            })
            // show hide add input field
            this.add = !this.add
        },
        showInputCurrencies() {
            // show hide add input field
            this.add = !this.add
        },
        // get new exchange rate when main currency is changed
        getNewExchangeRate() {
            fetch('https://api.exchangeratesapi.io/latest?base=' + this.mainCurrency)
            .then(resp => resp.json())
            .then(resp => {
                // change data on ui
                var addedRates = this.addedRate
                addedRates.map(el => {
                    el.rate = resp.rates[el.currency]
                })
            })
            
        },
        // remove rate from list
        removeList(idx) {
            this.addedRate.splice(idx, 1)
        }
    }
})

// Vue instance
var app = new Vue({
    el: '.wrapper',
    data: {
        abbreviations: {},
        exchangeratelist: {}
    },
    // set init data (USD)
    mounted() {
        var vm = this,
            urls = [
                // api for exchange rate
                'https://api.exchangeratesapi.io/latest?base=USD',
                // api for exchange rate abbreviation
                'https://openexchangerates.org/api/currencies.json'
            ]
        Promise.all(urls.map(url =>
            fetch(url).then(resp => resp.json())
        )).then(result => {
            var exchangeratelist = result[0].rates,
                abbreviations = result[1]
            // set vue data
            vm.abbreviations = abbreviations
            vm.exchangeratelist = exchangeratelist
        })
    }
})