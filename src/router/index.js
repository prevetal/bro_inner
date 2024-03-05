import { createRouter, createWebHistory } from 'vue-router'
import { useGlobalStore } from '@/stores'

import defaultLayout from '@/layouts/Default.vue'


const routes = [
    {
		path: '/',
		name: 'MainPage',
		component: () => import('../views/MainPage.vue'),
		meta: {
			layout: defaultLayout
		}
	},
    {
		path: '/multisend',
		name: 'Multisend',
		component: () => import('../views/Multisend.vue'),
		meta: {
			layout: defaultLayout
		}
	},
	{
		path: '/multisend/:network',
		name: 'MultisendForm',
		component: () => import('../views/MultisendForm.vue'),
		meta: {
			layout: defaultLayout
		}
	}
]


const router = createRouter({
	history: createWebHistory(),
	routes
})


router.beforeResolve(async (to, from, next) => {
	let store = useGlobalStore()

	// Current network from url
	if (to.params.network) {
		store.currentNetwork = to.params.network
	}

	next()
})


export default router
