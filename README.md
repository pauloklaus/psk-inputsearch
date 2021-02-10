# psk-inputsearch

Input Vue component for searching data in an API.

* Report bugs: https://github.com/pauloklaus/psk-inputsearch/issues

## Install

Create a new vue project:
```
vue create
```

Install component and dependencies:
```
npm install --save axios bootstrap bootstrap-vue psk-inputsearch
```

## Environment setting

Make a src/resources folder at the root:
```
mkdir src/resources
```

### Configure the axios

Create the src/resources/axios.js with the content:
```
import Vue from "vue";
import axios from "axios";

const http = axios.create({
    timeout: 60 * 1000,
});

Plugin.install = function(Vue, options) {
    Object.defineProperties(Vue.prototype, {
        $axios: {
            get() {
                return http;
            }
        }
    });
};

Vue.use(Plugin);
export default Plugin;
```

### Configure the bootstrap

Create the src/resources/bootstrap-vue.js:
```
import Vue from "vue";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
```

### Configure the psk-inputsearch

Create the src/resources/psk-inputsearch.js:
```
import InputSearch from "psk-inputsearch";
import "psk-inputsearch/dist/InputSearch.css";
Vue.use(InputSearch, { InputSearchName: "MyInputSearch" });
```

### Import psk-inputsearch and dependencies

The "src/main.js" file should look like this:
```
import Vue from "vue";
import App from "./App.vue";

import "./resources/axios";
import "./resources/bootstrap-vue";
import "./resources/psk-inputsearch";

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount("#app");

```

## How to use (example in App.vue)
```
<template>
    <div>
        My Input Search
        <my-input-search :url="url" text-field="title" :axios="$axios" v-model="value" placeholder="Find a product..." />
    </div>
</template>

<script>
export default {
    data() {
        return {
            url: "https://fakestoreapi.com/products",
            value: {}
        }
    }
}
</script>

<style>
* {
    border-radius: 0 !important;
}
input:focus,
button:focus {
    outline: none;
}
</style>
```

## Default JSON format
```
[
    { id: 1, description: "Test 1" },
    { id: 2, description: "Test 2" }
]
```

## Properties

Property | Description | Required | Default
-|-|-|-
url | API url | yes |
axios | Axios instance | yes |
inputId | html id to the input element | no | random id
autofocus | Focus on load page | no | false
disabled | To disable user input | no | false
debouce | Time to start the search when the user stops typing | no | 500
placeholder | Text to display when the input is empty | no | null
description | Explanation of use, displayed discreetly below the input | no | null
idField | JSON id field | no | id
textField | JSON field with description to display in the input when a list item is selected | no | description
customText | Function to customize text to display in the input | no | null
customFormatResult | Function to customize the result object | no | null
value | Value (an object like this { id: 1, descript: "Test 1" }) to bind selection | no | null
showActionButton | Display a button at the end of the input | no | false
actionButtonIcon | Action button icon (from https://bootstrap-vue.org/docs/icons) | no | box-arrow-up-right
iconVariant | Variant bootstrap color to the button: primary, secondary, success, warning, danger, info, light, dark | no | null

## Events

Event | Description
-|-
error | Axios response on error
change | When there is change
keydown | When a key is pressed
actionButtonClick | When a button is clicked

## Style customizing

Style | Description
-|-
.inputsearch-container | container box style
.inputsearch-result | result box style
.inputsearch-item | item style
.inputsearch-message | temporary style message
.inputsearch-selected | selected item style

## Using in the browser

To use directly in the browser, import bootstrap-vue before psk-inputsearch:
```
<script src="https://unpkg.com/vue-boostrap" />
<script src="https://unpkg.com/psk-inputsearch" />
```

## Thanks

For the support, friendship and knowledge they always share!

* Marlon Dauernheimer, https://github.com/DMarlon
* Álisson Bertochi, https://github.com/gnxbr

Marlon was essential to optimize and simplify the source code.
