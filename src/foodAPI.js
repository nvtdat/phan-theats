import { supabase } from './supabaseClient';

export async function fetchFoodData() {
    try {
    const { data, error} = await supabase.from('dishes').select('*');
    console.log('data:', data, 'error:', error);
    if (error) {
        console.error('Error fetching food data: ', error);
    } else {
        const withImageData = data.map(dish => ({
        ...dish,
        image_url: new URL(`./assets/dishes/${dish.slug}.jpg`, import.meta.url).href,
        }));
        return withImageData;
    }
    } catch(error) {
    console.error('Error fetching food data: ', error);
    }
}

export async function fetchFoodDetails(slug) {
    try {
        const { data, error } = await supabase.from('dishes').select('*').eq('slug', slug).single();
        console.log('data:', data, 'error:', error);
        if(error) {
            console.errorr('Error fetching food details: ', error);
        } else {
            const withImageData = {
                ...data,
                image_url: new URL(`./assets/dishes/${data.slug}.jpg`, import.meta.url).href,
            };
            return withImageData;
        }
    }
    catch(error) {
        console.error('Error fetching food details: ', error);
    }
}
