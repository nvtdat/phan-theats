import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://yvvzdrojkvvjxkhqxcyd.supabase.co';           // Project URL của bạn
const supabaseKey = 'sb_publishable_S_tR7DolrztNDVDNqX2DNA_vlfBYjRb';                            // dùng service_role key (chỉ dùng cho script, KHÔNG đưa vào frontend)


const supabase = createClient(supabaseUrl, supabaseKey);

const foodData = JSON.parse(fs.readFileSync('./foodData.json', 'utf-8'));

async function importData() {
  const { data, error } = await supabase
    .from('dishes')
    .insert(
      foodData.map(item => ({
        slug: item.slug,
        name: item.name,
        min_price: item.min_price,
        max_price: item.max_price,
        category: item.category,
        description: item.description,
        image_url: `${item.slug}.jpg`,   // chỉ lưu tên file, ảnh vẫn giữ local
      }))
    );

  if (error) console.error('Lỗi:', error);
  else console.log(`Đã import ${data?.length || foodData.length} món ăn thành công`);
}

importData();