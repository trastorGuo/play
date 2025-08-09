<template>
  <div class="itinerary-page">
    <div class="container">
      <div class="header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="title">北疆 10 天自驾逐小时行程（晚起晚玩版）</h1>
            <p class="subtitle">国庆档 | 建议起床 09:00-09:30，夜间活动至 22:30-23:30 | 单页总览 + 逐小时时间轴</p>
          </div>
          <button class="export-btn" @click="exportAsImage" :disabled="isExporting">
            <span class="export-icon">📷</span>
            <span class="export-text">{{ isExporting ? '生成中...' : '保存图片' }}</span>
          </button>
        </div>
      </div>

    

      <section class="overview">
        <h2 class="section-title">十天大行程总览</h2>
        <div class="overview-grid">
          <div class="day-card card" v-for="it in days" :key="it.d">
            <div class="day-top">
              <div class="day-label">{{ it.d }} {{ it.date }}</div>
            </div>
            <div class="route">{{ it.route }}</div>
            <div class="meta">
              <div class="km">{{ it.km }}</div>
              <div class="hotel">住宿：{{ it.hotel }}</div>
            </div>
          </div>
        </div>
             </section>

              <section class="route-flow">
         <h2 class="section-title">行程路线图</h2>
         <div class="flow-container card">
           <div class="flow-list">
             <div class="flow-item start-item">
               <div class="flow-dot start"></div>
               <div class="flow-content">
                 <div class="flow-city">乌鲁木齐</div>
                 <div class="flow-day">D1 起点</div>
               </div>
             </div>
             
             <div class="flow-arrow">
               <span class="arrow-line"></span>
               <span class="arrow-info">700km / 8h</span>
             </div>
             
             <div class="flow-item">
               <div class="flow-dot"></div>
               <div class="flow-content">
                 <div class="flow-city">布尔津</div>
                 <div class="flow-day">D2</div>
               </div>
             </div>
             
             <div class="flow-arrow">
               <span class="arrow-line"></span>
               <span class="arrow-info">150km / 3h</span>
             </div>
             
             <div class="flow-item scenic">
               <div class="flow-dot scenic"></div>
               <div class="flow-content">
                 <div class="flow-city">喀纳斯</div>
                 <div class="flow-day">D3-D4</div>
               </div>
             </div>
             
             <div class="flow-arrow">
               <span class="arrow-line"></span>
               <span class="arrow-info">70km / 2h</span>
             </div>
             
             <div class="flow-item scenic">
               <div class="flow-dot scenic"></div>
               <div class="flow-content">
                 <div class="flow-city">禾木</div>
                 <div class="flow-day">D5</div>
               </div>
             </div>
             
             <div class="flow-arrow">
               <span class="arrow-line"></span>
               <span class="arrow-info">450km / 6h</span>
             </div>
             
             <div class="flow-item">
               <div class="flow-dot"></div>
               <div class="flow-content">
                 <div class="flow-city">克拉玛依</div>
                 <div class="flow-day">D6</div>
               </div>
             </div>
             
             <div class="flow-arrow">
               <span class="arrow-line"></span>
               <span class="arrow-info">350km / 5h</span>
             </div>
             
             <div class="flow-item scenic">
               <div class="flow-dot scenic"></div>
               <div class="flow-content">
                 <div class="flow-city">赛里木湖</div>
                 <div class="flow-day">D7</div>
               </div>
             </div>
             
             <div class="flow-arrow">
               <span class="arrow-line"></span>
               <span class="arrow-info">350km / 5h</span>
             </div>
             
             <div class="flow-item scenic">
               <div class="flow-dot scenic"></div>
               <div class="flow-content">
                 <div class="flow-city">那拉提</div>
                 <div class="flow-day">D8</div>
               </div>
             </div>
             
             <div class="flow-arrow">
               <span class="arrow-line"></span>
               <span class="arrow-info">140km / 3h</span>
             </div>
             
             <div class="flow-item scenic">
               <div class="flow-dot scenic"></div>
               <div class="flow-content">
                 <div class="flow-city">巴音布鲁克</div>
                 <div class="flow-day">D9</div>
               </div>
             </div>
             
             <div class="flow-arrow">
               <span class="arrow-line"></span>
               <span class="arrow-info">500km / 6h</span>
             </div>
             
             <div class="flow-item end-item">
               <div class="flow-dot end"></div>
               <div class="flow-content">
                 <div class="flow-city">乌鲁木齐</div>
                 <div class="flow-day">D10 终点</div>
               </div>
             </div>
           </div>
         </div>
       </section>

       <section class="timelines">
         <div class="timeline-top">
           <h2 class="section-title">每天逐小时安排（09:00 - 23:30）</h2>
           <div class="legend card">
             <div class="legend-content">
               <h3 class="legend-title">图例</h3>
               <div class="legend-items">
                 <span class="lg-chip" style="background: var(--c-drive)"></span>
                 <span class="mini">行车</span>
                 <span class="lg-chip" style="background: var(--c-scenic)"></span>
                 <span class="mini">景点/徒步</span>
                 <span class="lg-chip" style="background: var(--c-meal)"></span>
                 <span class="mini">用餐</span>
                 <span class="lg-chip" style="background: var(--c-rest)"></span>
                 <span class="mini">休整/入住</span>
                 <span class="lg-chip" style="background: var(--c-sunset)"></span>
                 <span class="mini">日落/拍摄</span>
                 <span class="lg-chip" style="background: var(--c-night)"></span>
                 <span class="mini">夜游/星空</span>
               </div>
             </div>
           </div>
         </div>
        <div class="timeline-header">
          <div class="gline"></div>
          <div v-for="h in hours" :key="h" class="tick" :style="tickStyle(h)">
            <span>{{ h }}:00</span>
          </div>
        </div>

        <div class="timeline-container" v-for="day in plan" :key="day.d">
          <div class="timeline-row">
            <div class="left card">
              <div class="left-title">
                <span class="day-label">{{ day.d }} {{ day.date }}</span>
              </div>
              <div class="left-sub">{{ day.summary }}</div>
            </div>
            <div class="right">
              <div class="track is-compact">
                <div class="rail">
                  <div
                    v-for="(ev, j) in day.events"
                    :key="j"
                    class="bar bar-compact"
                    :class="'type-' + ev[2]"
                    :style="barStyle(ev[0], ev[1])"
                  >
                    <span class="bar-icon" aria-hidden="true">{{ iconChar(ev[2]) }}</span>
                    <span class="bar-label" :class="getLabelSizeClass(ev[3], ev[0], ev[1])">{{ ev[3] }}</span>
                    <span v-if="ev[2] === 'drive'" class="bar-extra">{{ driveExtra(ev[0], ev[1], ev[3]) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row-sep"></div>
        </div>
      </section>

      <section class="detailed-itinerary">
        <h2 class="section-title">详细行程安排</h2>
        <div class="detailed-container">
          <div class="detailed-day card" v-for="day in detailedPlan" :key="day.d">
            <div class="day-header">
              <div class="day-number">{{ day.d }}</div>
              <div class="day-info">
                <h3 class="day-title">{{ day.title }}</h3>
                <div class="day-meta">
                  <span class="day-date">{{ day.date }}</span>
                  <span class="day-weather">{{ day.weather }}</span>
                  <span class="day-distance">{{ day.distance }}</span>
                </div>
              </div>
            </div>
            
            <div class="day-content">
              <div class="highlights">
                <h4 class="content-title">🌟 今日亮点</h4>
                <ul class="highlight-list">
                  <li v-for="highlight in day.highlights" :key="highlight">{{ highlight }}</li>
                </ul>
              </div>
              
              <div class="schedule">
                <h4 class="content-title">📅 详细安排</h4>
                <div class="schedule-list">
                  <div class="schedule-item" v-for="item in day.schedule" :key="item.time">
                    <div class="schedule-time">{{ item.time }}</div>
                    <div class="schedule-content">
                      <div class="schedule-title">{{ item.title }}</div>
                      <div class="schedule-desc" v-if="item.desc">{{ item.desc }}</div>
                      <div class="schedule-tips" v-if="item.tips">
                        <span class="tips-label">💡 小贴士：</span>{{ item.tips }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="recommendations" v-if="day.recommendations">
                <h4 class="content-title">🎯 推荐体验</h4>
                <div class="rec-grid">
                  <div class="rec-item" v-for="rec in day.recommendations" :key="rec.title">
                    <div class="rec-icon">{{ rec.icon }}</div>
                    <div class="rec-text">
                      <div class="rec-title">{{ rec.title }}</div>
                      <div class="rec-desc">{{ rec.desc }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="accommodation" v-if="day.accommodation">
                <h4 class="content-title">🏨 住宿推荐</h4>
                <div class="acc-info">
                  <div class="acc-name">{{ day.accommodation.name }}</div>
                  <div class="acc-type">{{ day.accommodation.type }}</div>
                  <div class="acc-tips">{{ day.accommodation.tips }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isExporting = ref(false)

// 导出为图片
async function exportAsImage() {
  isExporting.value = true
  
  try {
    // 隐藏保存按钮
    const exportBtn = document.querySelector('.export-btn')
    if (exportBtn) exportBtn.style.display = 'none'
    
    // 动态导入html2canvas
    const html2canvas = (await import('html2canvas')).default
    
    // 获取要截图的元素
    const element = document.querySelector('.itinerary-page')
    
    // 配置选项
    const options = {
      backgroundColor: '#ffffff',
      scale: 2, // 提高清晰度
      useCORS: true,
      allowTaint: true,
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0
    }
    
    // 生成canvas
    const canvas = await html2canvas(element, options)
    
    // 转换为blob并下载
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `北疆10天自驾行程-${new Date().toLocaleDateString('zh-CN').replace(/\//g, '')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 'image/png', 0.9)
    
  } catch (error) {
    console.error('导出图片失败:', error)
    alert('导出图片失败，请重试')
  } finally {
    // 恢复保存按钮显示
    const exportBtn = document.querySelector('.export-btn')
    if (exportBtn) exportBtn.style.display = 'flex'
    isExporting.value = false
  }
}

const days = [
  { d: 'D1', date: '10/1', route: '乌鲁木齐市区', km: '<50 km', hotel: '乌鲁木齐' },
  { d: 'D2', date: '10/2', route: '乌鲁木齐 → 布尔津', km: '700 km / 8h', hotel: '布尔津' },
  { d: 'D3', date: '10/3', route: '布尔津 → 贾登峪(喀纳斯)', km: '150 km / 3h', hotel: '贾登峪' },
  { d: 'D4', date: '10/4', route: '喀纳斯深度(白哈巴往返)', km: '80 km / 2h', hotel: '贾登峪' },
  { d: 'D5', date: '10/5', route: '贾登峪 → 禾木', km: '70 km / 2h', hotel: '禾木' },
  { d: 'D6', date: '10/6', route: '禾木 → 克拉玛依', km: '450 km / 6h', hotel: '克拉玛依' },
  { d: 'D7', date: '10/7', route: '克拉玛依 → 赛里木湖', km: '350 km / 5h', hotel: '清水河镇/湖畔' },
  { d: 'D8', date: '10/8', route: '赛里木湖 → 那拉提', km: '350 km / 5h', hotel: '那拉提' },
  { d: 'D9', date: '10/9', route: '那拉提 → 巴音布鲁克', km: '140 km / 3h', hotel: '巴音布鲁克' },
  { d: 'D10', date: '10/10', route: '巴音布鲁克 → 乌鲁木齐 → 机场', km: '500 km / 6h', hotel: '返程' }
];

const plan = [
  { d: 'D1', date: '10/1', summary: '市区适应 + 夜游大巴扎', events: [
    ['14:00', '15:00', 'rest', '抵达入住'],
    ['15:00', '16:00', 'rest', '采购补给'],
    ['16:00', '18:30', 'scenic', '红山大巴扎'],
    ['18:30', '20:00', 'meal', '晚餐'],
    ['20:00', '22:00', 'night', '夜市']
  ]},
  { d: 'D2', date: '10/2', summary: '长途进北疆 + 五彩滩', events: [
    ['09:00', '09:45', 'meal', '早餐'],
    ['09:45', '12:00', 'drive', '上高速'],
    ['12:00', '12:45', 'meal', '午餐'],
    ['12:45', '17:30', 'drive', '到布尔津'],
    ['17:30', '18:10', 'rest', '入住'],
    ['18:10', '20:00', 'scenic', '五彩滩'],
    ['20:00', '21:00', 'meal', '晚餐'],
    ['21:00', '22:00', 'night', '河堤夜市']
  ]},
  { d: 'D3', date: '10/3', summary: '喀纳斯三湾 + 观鱼台', events: [
    ['09:00', '10:00', 'meal', '早餐退房'],
    ['10:00', '12:30', 'drive', '到贾登峪'],
    ['12:30', '13:30', 'meal', '午餐换乘'],
    ['13:30', '16:30', 'scenic', '喀纳斯三湾'],
    ['16:45', '17:10', 'drive', '到喀纳斯村'],
    ['17:10', '18:20', 'scenic', '观鱼台'],
    ['18:20', '19:30', 'rest', '下撤候车'],
    ['19:30', '20:00', 'drive', '回贾登峪'],
    ['20:00', '21:00', 'meal', '晚餐'],
    ['21:00', '22:30', 'night', '星空']
  ]},
  { d: 'D4', date: '10/4', summary: '白哈巴边村一日', events: [
    ['09:30', '10:30', 'meal', '早餐'],
    ['10:30', '11:30', 'drive', '到白哈巴'],
    ['11:30', '12:30', 'scenic', '白哈巴村'],
    ['12:30', '13:30', 'meal', '午餐'],
    ['13:30', '14:30', 'scenic', '观景台'],
    ['14:30', '16:00', 'scenic', '白桦林'],
    ['16:00', '17:00', 'drive', '返贾登峪'],
    ['17:30', '19:00', 'scenic', '月亮湾'],
    ['19:00', '19:30', 'scenic', '湖边'],
    ['19:30', '20:30', 'meal', '晚餐'],
    ['21:00', '22:00', 'rest', '休息']
  ]},
  { d: 'D5', date: '10/5', summary: '转场禾木 + 观景台', events: [
    ['09:30', '10:30', 'meal', '早餐退房'],
    ['10:30', '12:30', 'drive', '到禾木'],
    ['12:30', '14:00', 'meal', '午餐入住'],
    ['14:00', '16:30', 'scenic', '禾木河谷'],
    ['16:30', '18:50', 'scenic', '禾木观景台'],
    ['18:50', '20:00', 'meal', '晚餐'],
    ['21:00', '23:00', 'night', '篝火星空']
  ]},
  { d: 'D6', date: '10/6', summary: '长驱克拉玛依 + 魔鬼城', events: [
    ['09:00', '10:00', 'meal', '早餐/退房'],
    ['10:00', '12:30', 'drive', '出村上路'],
    ['12:30', '13:20', 'meal', '午餐'],
    ['13:20', '16:50', 'drive', '到克拉玛依'],
    ['16:50', '18:30', 'scenic', '世界魔鬼城'],
    ['20:00', '20:40', 'meal', '晚餐'],
    ['20:40', '21:30', 'night', '夜游']
  ]},
  { d: 'D7', date: '10/7', summary: '赛里木湖', events: [
    ['09:00', '10:00', 'meal', '早餐'],
    ['10:00', '12:30', 'drive', '赴精河/霍城方向'],
    ['12:30', '13:30', 'meal', '午餐'],
    ['13:30', '15:30', 'drive', '到湖区'],
    ['15:30', '16:00', 'rest', '入住/整装'],
    ['16:00', '19:00', 'scenic', '赛里木湖'],
    ['19:00', '20:00', 'scenic', '湖畔'],
    ['20:00', '21:00', 'meal', '晚餐'],
    ['21:00', '23:00', 'night', '观星']
  ]},
  { d: 'D8', date: '10/8', summary: '那拉提空中草原', events: [
    ['09:30', '10:30', 'scenic', '赛里木湖晨景'],
    ['10:30', '12:30', 'drive', '向新源/特克斯'],
    ['12:30', '13:30', 'meal', '午餐'],
    ['13:30', '15:30', 'drive', '抵那拉提'],
    ['15:30', '16:30', 'rest', '入住'],
    ['16:30', '18:30', 'scenic', '那拉提草原'],
    ['18:30', '19:30', 'scenic', '空中草原'],
    ['20:00', '21:00', 'meal', '晚餐'],
    ['21:00', '23:00', 'night', '河谷夜色']
  ]},
  { d: 'D9', date: '10/9', summary: '天鹅湖 + 九曲十八弯', events: [
    ['09:30', '11:00', 'meal', '早餐/准备'],
    ['11:00', '13:00', 'drive', '赴巴音布鲁克'],
    ['13:00', '14:00', 'meal', '午餐'],
    ['14:00', '15:00', 'rest', '入住'],
    ['15:00', '18:00', 'scenic', '天鹅湖'],
    ['18:00', '20:30', 'scenic', '九曲十八弯'],
    ['20:30', '21:00', 'drive', '返回镇上'],
    ['21:00', '22:30', 'night', '夜拍'],
    ['22:30', '23:00', 'rest', '休息']
  ]},
  { d: 'D10', date: '10/10', summary: '独库北段返乌市（建议晚航班）', events: [
    ['09:30', '10:30', 'meal', '早餐/退房'],
    ['10:30', '12:30', 'drive', '独库北段'],
    ['12:30', '13:30', 'meal', '午餐'],
    ['13:30', '17:30', 'drive', '继续北上返乌市'],
    ['17:30', '18:30', 'rest', '还车/整理行李'],
    ['18:30', '19:30', 'meal', '晚餐'],
    ['19:30', '20:30', 'drive', '前往机场'],
    ['20:30', '22:00', 'rest', '还车/值机安检']
  ]}
];

const detailedPlan = [
  {
    d: 'D1',
    date: '10月1日',
    title: '抵达乌鲁木齐，市区适应',
    weather: '晴，15-25°C',
    distance: '市内50km',
    highlights: [
      '适应高原环境，调整时差',
      '体验新疆特色美食',
      '感受浓郁的西域风情'
    ],
    schedule: [
      { time: '14:00', title: '抵达乌鲁木齐', desc: '机场接机，入住酒店', tips: '建议预订市中心酒店，交通便利' },
      { time: '15:00', title: '采购物资', desc: '超市购买路上所需用品', tips: '准备保温杯、零食、防晒用品等' },
      { time: '16:00', title: '红山公园', desc: '俯瞰乌鲁木齐全景', tips: '可拍摄城市全景照片' },
      { time: '18:30', title: '品尝新疆菜', desc: '大盘鸡、抓饭、烤包子', tips: '推荐老牌餐厅：阿布拉的馕' },
      { time: '20:00', title: '大巴扎夜市', desc: '购买特产，感受夜市氛围', tips: '记得砍价，带好现金' }
    ],
    recommendations: [
      { icon: '🍖', title: '美食推荐', desc: '大盘鸡、椒麻鸡、手抓羊肉、烤包子' },
      { icon: '🛍️', title: '特产采购', desc: '和田玉、葡萄干、馕饼、哈密瓜干' },
      { icon: '📸', title: '拍照点', desc: '红山塔、大巴扎建筑群、民族服饰体验' }
    ],
    accommodation: {
      name: '乌鲁木齐希尔顿酒店',
      type: '五星级商务酒店',
      tips: '位置优越，设施完善，适合休息调整'
    }
  },
  {
    d: 'D2',
    date: '10月2日',
    title: '乌鲁木齐→布尔津（700km）',
    weather: '晴，10-20°C',
    distance: '行车700km，约8小时',
    highlights: [
      '穿越准噶尔盆地',
      '五彩滩地质奇观',
      '额尔齐斯河日落'
    ],
    schedule: [
      { time: '09:00', title: '酒店早餐', desc: '充足早餐，准备长途驾驶', tips: '多准备路上的食物和水' },
      { time: '09:45', title: '出发上高速', desc: 'G217国道北上', tips: '检查车况，备好充电宝' },
      { time: '12:00', title: '克拉玛依午餐', desc: '服务区休息用餐', tips: '可顺便加油，下一段路程较长' },
      { time: '17:30', title: '抵达布尔津', desc: '入住酒店，短暂休息', tips: '选择靠近五彩滩的酒店' },
      { time: '18:10', title: '五彩滩观日落', desc: '雅丹地貌，绚丽晚霞', tips: '带好相机，注意保暖' },
      { time: '20:00', title: '河堤夜市', desc: '品尝烤鱼，散步消食', tips: '额尔齐斯河烤鱼是特色' }
    ],
    recommendations: [
      { icon: '🏞️', title: '五彩滩', desc: '中国最美雅丹地貌，日落时分色彩斑斓' },
      { icon: '🐟', title: '额尔齐斯河鱼', desc: '野生冷水鱼，肉质鲜美，推荐烤鱼' },
      { icon: '🌅', title: '摄影技巧', desc: '黄昏时使用暖色调滤镜，突出地貌层次' }
    ],
    accommodation: {
      name: '布尔津神湖大酒店',
      type: '当地四星级酒店',
      tips: '位置佳，可看到额尔齐斯河，早餐丰富'
    }
  },
  {
    d: 'D3',
    date: '10月3日',
    title: '布尔津→喀纳斯（150km）',
    weather: '多云，5-15°C',
    distance: '行车150km，约3小时',
    highlights: [
      '神秘喀纳斯湖',
      '观鱼台俯瞰全景',
      '寻找湖怪传说'
    ],
    schedule: [
      { time: '09:00', title: '退房早餐', desc: '准备前往喀纳斯', tips: '带好保暖衣物，山区温差大' },
      { time: '10:00', title: '前往贾登峪', desc: '喀纳斯景区换乘中心', tips: '私家车只能到贾登峪，需换乘区间车' },
      { time: '12:30', title: '午餐换乘', desc: '贾登峪用餐，购买景区票', tips: '建议购买三湾+观鱼台套票' },
      { time: '13:30', title: '游览三湾', desc: '卧龙湾→月亮湾→神仙湾', tips: '可选择徒步栈道，风景更佳' },
      { time: '16:45', title: '乘车到喀纳斯村', desc: '湖边近距离观赏', tips: '湖水颜色会随光线变化' },
      { time: '17:10', title: '观鱼台日落', desc: '1068级台阶，俯瞰全湖', tips: '体力消耗大，量力而行' }
    ],
    recommendations: [
      { icon: '🥾', title: '徒步路线', desc: '三湾栈道徒步，单程2.5km，风景绝佳' },
      { icon: '📷', title: '最佳拍摄', desc: '观鱼台顶部、月亮湾S弯、神仙湾晨雾' },
      { icon: '🎣', title: '湖怪传说', desc: '注意观察湖面，据说有神秘生物出没' }
    ],
    accommodation: {
      name: '贾登峪山庄',
      type: '景区特色小木屋',
      tips: '环境原生态，晚上可观星，需提前预订'
    }
  },
  {
    d: 'D4',
    date: '10月4日',
    title: '白哈巴边境村落深度游',
    weather: '晴转多云，0-12°C',
    distance: '往返80km，山路',
    highlights: [
      '中哈边境第一村',
      '图瓦人原始生活',
      '白桦林金秋美景'
    ],
    schedule: [
      { time: '09:30', title: '早餐出发', desc: '前往白哈巴边境检查站', tips: '需携带身份证，边防证可现场办理' },
      { time: '10:30', title: '抵达白哈巴', desc: '办理边防手续，进入村落', tips: '保持证件随身，配合检查' },
      { time: '11:30', title: '村落漫步', desc: '图瓦人木屋，原始村庄', tips: '可以和当地人交流，了解民俗' },
      { time: '12:30', title: '特色午餐', desc: '图瓦人家庭料理', tips: '马奶酒需适量，奶茶可多喝' },
      { time: '14:30', title: '白桦林徒步', desc: '金秋白桦，层林尽染', tips: '带好相机，注意脚下安全' },
      { time: '17:30', title: '返回月亮湾', desc: '途中再次欣赏月亮湾', tips: '傍晚光线柔和，适合拍照' }
    ],
    recommendations: [
      { icon: '🏡', title: '图瓦人家访', desc: '体验原始生活，品尝传统美食' },
      { icon: '🍂', title: '白桦林摄影', desc: '金黄色叶片，最佳拍摄时间14:00-16:00' },
      { icon: '🎭', title: '民俗体验', desc: '学习图瓦族传统手工艺，购买纪念品' }
    ],
    accommodation: {
      name: '贾登峪山庄',
      type: '景区特色小木屋',
      tips: '继续住宿，明日转场禾木'
    }
  },
  {
    d: 'D5',
    date: '10月5日',
    title: '转场禾木村',
    weather: '晴，-5-10°C',
    distance: '行车70km，约2小时',
    highlights: [
      '神的自留地禾木',
      '炊烟袅袅的童话世界',
      '禾木观景台日落'
    ],
    schedule: [
      { time: '09:30', title: '早餐退房', desc: '告别贾登峪，前往禾木', tips: '山路较多弯道，注意安全驾驶' },
      { time: '10:30', title: '前往禾木', desc: '沿途欣赏阿尔泰山风光', tips: '路况良好，可适当停车拍照' },
      { time: '12:30', title: '禾木村用餐', desc: '入住小木屋，品尝当地美食', tips: '选择河边小木屋，风景更佳' },
      { time: '14:00', title: '河谷漫步', desc: '禾木河畔，白桦林间', tips: '可选择骑马体验，约100元/小时' },
      { time: '16:30', title: '攀登观景台', desc: '俯瞰禾木全景', tips: '需徒步40分钟，建议穿登山鞋' },
      { time: '18:50', title: '观景台日落', desc: '禾木村炊烟袅袅', tips: '是禾木最经典的景色，不容错过' }
    ],
    recommendations: [
      { icon: '🐎', title: '骑马体验', desc: '沿禾木河骑行，感受哈萨克牧民生活' },
      { icon: '🌄', title: '晨雾拍摄', desc: '清晨5:30-7:00，村庄笼罩在薄雾中' },
      { icon: '🔥', title: '篝火晚会', desc: '晚上和其他游客一起围火聊天，观星空' }
    ],
    accommodation: {
      name: '禾木山庄',
      type: '原生态小木屋',
      tips: '无WiFi，但可体验纯自然环境，记得带好保暖用品'
    }
  },
  {
    d: 'D6',
    date: '10月6日',
    title: '禾木→克拉玛依（450km）',
    weather: '晴，5-18°C',
    distance: '行车450km，约6小时',
    highlights: [
      '告别阿尔泰山区',
      '世界魔鬼城奇观',
      '感受地质变迁'
    ],
    schedule: [
      { time: '09:00', title: '早餐退房', desc: '告别禾木童话世界', tips: '早起可拍摄禾木晨雾，非常美丽' },
      { time: '10:00', title: '下山出村', desc: '沿原路返回主道', tips: '山路注意安全，控制车速' },
      { time: '12:30', title: '途中午餐', desc: '福海县城用餐休息', tips: '可补充油料和食物' },
      { time: '16:50', title: '抵达克拉玛依', desc: '入住酒店，短暂休息', tips: '选择市中心酒店，方便晚餐' },
      { time: '17:30', title: '世界魔鬼城', desc: '乌尔禾魔鬼城地质公园', tips: '乘坐小火车游览，约2小时' },
      { time: '20:00', title: '克拉玛依晚餐', desc: '品尝当地石油工人餐厅', tips: '推荐大盘鸡和手抓饭' }
    ],
    recommendations: [
      { icon: '🚂', title: '魔鬼城小火车', desc: '乘坐观光小火车，轻松游览各个景点' },
      { icon: '🏜️', title: '地质奇观', desc: '亿万年风蚀形成，形似城堡废墟' },
      { icon: '📖', title: '地质科普', desc: '了解新疆地质变迁史，增长知识' }
    ],
    accommodation: {
      name: '克拉玛依宾馆',
      type: '石油城市酒店',
      tips: '设施完善，具有浓郁的石油工业特色'
    }
  },
  {
    d: 'D7',
    date: '10月7日',
    title: '克拉玛依→赛里木湖（350km）',
    weather: '晴转多云，8-16°C',
    distance: '行车350km，约5小时',
    highlights: [
      '大西洋最后一滴眼泪',
      '高山湖泊纯净美景',
      '环湖自驾体验'
    ],
    schedule: [
      { time: '09:00', title: '酒店早餐', desc: '准备前往赛里木湖', tips: '路程较长，多准备零食和水' },
      { time: '10:00', title: '出发南下', desc: 'G30连霍高速转G577', tips: '路况良好，注意限速' },
      { time: '12:30', title: '精河午餐', desc: '精河县城休息用餐', tips: '可尝试当地的薄皮包子' },
      { time: '15:30', title: '抵达湖区', desc: '办理入湖手续，选择住宿', tips: '湖边毡房体验感更佳' },
      { time: '16:00', title: '环湖游览', desc: '沿湖公路自驾观景', tips: '全程约90km，注意安全' },
      { time: '19:00', title: '湖畔观日落', desc: '赛里木湖绝美日落', tips: '湖边风大，注意保暖' }
    ],
    recommendations: [
      { icon: '🚗', title: '环湖自驾', desc: '90km环湖路，每个角度都有不同美景' },
      { icon: '🏕️', title: '毡房住宿', desc: '哈萨克族毡房，体验游牧生活' },
      { icon: '⭐', title: '观星体验', desc: '高原湖泊，星空清澈，适合天文摄影' }
    ],
    accommodation: {
      name: '赛湖毡房度假村',
      type: '特色毡房住宿',
      tips: '体验游牧文化，但设施相对简单，需有心理准备'
    }
  },
  {
    d: 'D8',
    date: '10月8日',
    title: '赛里木湖→那拉提草原',
    weather: '多云转晴，10-18°C',
    distance: '行车350km，约5小时',
    highlights: [
      '告别高原明珠赛里木湖',
      '空中草原那拉提',
      '哈萨克族牧民文化'
    ],
    schedule: [
      { time: '09:30', title: '湖畔晨光', desc: '最后一次欣赏赛里木湖', tips: '清晨湖面如镜，是拍照的最佳时机' },
      { time: '10:30', title: '出发那拉提', desc: '经过新源、特克斯方向', tips: '沿途经过伊犁河谷，风景优美' },
      { time: '12:30', title: '新源午餐', desc: '品尝伊犁特色美食', tips: '推荐熏马肉、奶茶、包尔萨克' },
      { time: '15:30', title: '抵达那拉提', desc: '办理入住，稍作休息', tips: '选择景区内的哈萨克毡房更有特色' },
      { time: '16:30', title: '那拉提草原', desc: '河谷草原，牛羊成群', tips: '可选择骑马或徒步，体验牧民生活' },
      { time: '18:30', title: '空中草原', desc: '海拔2200米的高山草甸', tips: '需乘坐区间车，山顶风大注意保暖' }
    ],
    recommendations: [
      { icon: '🐎', title: '骑马体验', desc: '在哈萨克向导带领下体验游牧生活' },
      { icon: '🎪', title: '毡房住宿', desc: '入住传统毡房，感受牧民文化' },
      { icon: '🥛', title: '马奶酒', desc: '品尝传统发酵马奶酒，但需适量' }
    ],
    accommodation: {
      name: '那拉提草原度假村',
      type: '草原特色毡房',
      tips: '可选择毡房或木屋，毡房更有特色但设施简单'
    }
  },
  {
    d: 'D9',
    date: '10月9日',
    title: '那拉提→巴音布鲁克',
    weather: '晴，5-15°C',
    distance: '行车140km，约3小时',
    highlights: [
      '中国最大的高山草原',
      '天鹅湖候鸟天堂',
      '九曲十八弯黄昏奇观'
    ],
    schedule: [
      { time: '09:30', title: '早餐准备', desc: '在草原享受哈萨克早餐', tips: '奶茶配馕饼，体验牧民生活' },
      { time: '11:00', title: '前往巴音布鲁克', desc: '翻越天山支脉', tips: '山路海拔较高，注意高反' },
      { time: '13:00', title: '巴音镇午餐', desc: '蒙古族特色餐厅', tips: '手抓羊肉是当地特色' },
      { time: '14:00', title: '入住休息', desc: '适应高原环境', tips: '海拔2400米，多喝水少运动' },
      { time: '15:00', title: '天鹅湖', desc: '观赏天鹅等候鸟', tips: '带望远镜，保持安静不要惊扰候鸟' },
      { time: '18:00', title: '九曲十八弯', desc: '开都河蜿蜒奇观', tips: '日落时分最美，是摄影绝佳时机' }
    ],
    recommendations: [
      { icon: '🦢', title: '天鹅观察', desc: '10月正值候鸟迁徙季，天鹅数量众多' },
      { icon: '📸', title: '日落摄影', desc: '九曲十八弯日落是新疆经典景色' },
      { icon: '🌌', title: '高原星空', desc: '海拔高空气清薄，观星条件极佳' }
    ],
    accommodation: {
      name: '巴音布鲁克宾馆',
      type: '高原小镇酒店',
      tips: '设施基本，但位置便利，晚上注意保暖'
    }
  },
  {
    d: 'D10',
    date: '10月10日',
    title: '巴音布鲁克→乌鲁木齐（返程）',
    weather: '晴，8-20°C',
    distance: '行车500km，约6小时',
    highlights: [
      '独库公路北段体验',
      '天山大峡谷风光',
      '圆满结束北疆之旅'
    ],
    schedule: [
      { time: '09:30', title: '早餐退房', desc: '告别巴音布鲁克草原', tips: '检查行李，确保没有遗漏物品' },
      { time: '10:30', title: '独库公路北段', desc: '中国最美公路之一', tips: '沿途风景壮美，可适当停车拍照' },
      { time: '12:30', title: '路上午餐', desc: '沿途服务区用餐', tips: '准备一些干粮，山区餐厅选择有限' },
      { time: '17:30', title: '抵达乌鲁木齐', desc: '还车整理行李', tips: '检查车辆，办理还车手续' },
      { time: '18:30', title: '告别晚餐', desc: '品尝最后的新疆美食', tips: '推荐大盘鸡、拌面作为告别餐' },
      { time: '19:30', title: '前往机场', desc: '准备返程航班', tips: '预留充足时间，乌鲁木齐机场较大' }
    ],
    recommendations: [
      { icon: '🛣️', title: '独库公路', desc: '全程风景如画，被誉为中国最美公路' },
      { icon: '🎁', title: '特产采购', desc: '机场免税店可购买葡萄干、和田玉等' },
      { icon: '📝', title: '旅行总结', desc: '整理照片，记录10天的美好回忆' }
    ],
    accommodation: {
      name: '返程航班',
      type: '结束愉快旅程',
      tips: '建议预订晚上21:00以后的航班，留足时间'
    }
  }
];

const startMin = toMin('09:00');
const endMin = toMin('23:30');
const hours = Array.from({ length: 15 }, (_, i) => 9 + i);

function toMin(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function percent(min) {
  return ((min - startMin) / (endMin - startMin)) * 100;
}

function barStyle(start, end) {
  const left = percent(toMin(start));
  const width = Math.max(0.5, percent(toMin(end)) - left);
  const isShort = width < 8; // 宽度百分比
  return {
    left: left + '%',
    width: width + '%',
    ...(isShort ? { padding: '0 8px', borderRadius: '10px' } : {})
  };
}

function tickStyle(hour) {
  const x = percent(toMin(String(hour).padStart(2, '0') + ':00'));
  return { left: `${x}%` };
}

function iconChar(type) {
  switch (type) {
    case 'drive': return '🚗';
    case 'meal': return '🍚';
    case 'rest': return '🏨';
    case 'sunset': return '🌇';
    case 'night': return '🌃';
    case 'scenic':
    default: return '🏞️';
  }
}

// 行车路段距离映射
const driveDistances = {
  '上高速': '120km',
  '继续前进': '280km', 
  '到布尔津': '350km',
  '到贾登峪': '150km',
  '到喀纳斯村': '10km',
  '回贾登峪': '10km',
  '到白哈巴': '25km',
  '返贾登峪': '25km',
  '到禾木': '70km',
  '出村上路': '200km',
  '到湖区': '180km',
  '向新源/特克斯': '220km',
  '抵那拉提': '130km',
  '赴巴音布鲁克': '140km',
  '返回镇上': '30km',
  '独库北段': '200km',
  '继续北上返乌市': '300km',
  '前往机场': '50km'
};

function driveExtra(start, end, label) {
  const durMin = toMin(end) - toMin(start);
  const timeStr = `${Math.max(0.5, Math.round((durMin/60)*10)/10)}h`;
  const distanceStr = driveDistances[label] || `${Math.round(durMin/60*80)}km`;
  return `${distanceStr}/${timeStr}`;
}

function getLabelSizeClass(label, start, end) {
  const widthPercent = percent(toMin(end)) - percent(toMin(start));
  const textLength = label.length;
  
  // 根据气泡宽度和文字长度动态调整字体大小
  if (widthPercent < 3 || textLength > 8) return 'tiny';
  if (widthPercent < 5 || textLength > 6) return 'small';
  return '';
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;600;700&display=swap');

/* 页面特定样式 - 移除全局覆盖 */

/* 移动端滚动强制重置 */
@media (max-width: 768px) {
  .itinerary-page {
    position: static !important;
    overflow: visible !important;
    height: auto !important;
    min-height: 100vh;
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
  }
}

.itinerary-page {
  --c-text: #0F172A;
  --c-sub: #334155;
  --c-muted: #475569;
  --c-border: #E2E8F0;
  --c-panel: #F8FAFC;
  --c-rail: #F1F5F9;

  --c-drive: #3B82F6;
  --c-scenic: #10B981;
  --c-meal: #F59E0B;
  --c-rest: #CBD5E1;
  --c-sunset: #F97316;
  --c-night: #8B5CF6;

  --leftW: 260px;
  --gap: 16px;

  background: linear-gradient(#F8FAFC, #FFFFFF);
  color: var(--c-text);
  font-family: 'Noto Sans SC', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  min-height: 100vh;
  position: relative;
}

.container {
  max-width: 98vw;
  margin: 0 auto;
  padding: 20px 12px 80px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow-y: visible;
}

.header {
  margin: 8px 0 4px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.header-text {
  flex: 1;
}

.title {
  font-weight: 800;
  font-size: 28px;
  margin: 8px 0 4px;
  background: linear-gradient(180deg,#0F172A,#334155);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.subtitle {
  font-weight: 600;
  font-size: 14px;
  color: var(--c-sub);
  margin: 0 0 8px;
}

.export-btn {
  background: linear-gradient(135deg, #3B82F6, #1E40AF);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 120px;
  justify-content: center;
}

.export-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.export-btn:active:not(:disabled) {
  transform: translateY(0);
}

.export-btn:disabled {
  background: linear-gradient(135deg, #94A3B8, #64748B);
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 6px rgba(148, 163, 184, 0.3);
}

.export-icon {
  font-size: 16px;
}

.export-text {
  letter-spacing: 0.3px;
}

.card {
  background: #fff;
  border: 1px solid var(--c-border);
  border-radius: 12px;
}

.legend {
  padding: 12px 16px;
}
.legend-content { display: flex; align-items: center; gap: 16px; }
.legend-title { font-weight: 800; font-size: 14px; color: #0F172A; letter-spacing: .3px; margin: 0; }
.legend-items { display: flex; align-items: center; gap: 8px 14px; flex-wrap: wrap; }
.lg-chip { width: 18px; height: 10px; border-radius: 3px; display: inline-block; }
.mini { font-weight: 400; font-size: 12px; color: var(--c-muted); }

.section-title {
  font-weight: 600;
  font-size: 16px;
  color: var(--c-sub);
  margin: 16px 0 8px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
.day-card { padding: 10px 12px; background: linear-gradient(180deg,#FFFFFF,#F8FAFC); }
.day-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.day-label { font-weight: 700; font-size: 16px; color: #0F172A; }
.route { font-size: 14px; color: #1F2937; margin: 6px 0 8px; }
.meta { display: flex; justify-content: space-between; align-items: center; }
.km { font-weight: 700; font-size: 12px; color: #0284C7; }
.hotel { font-weight: 700; font-size: 12px; color: #059669; }

.timelines { margin-top: 12px; }
.timeline-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.timeline-header {
  position: relative;
  height: 24px;
  display: grid;
  grid-template-columns: var(--leftW) 1fr;
  gap: var(--gap);
}
.timeline-header .gline {
  grid-column: 2;
  position: absolute; 
  left: 0; 
  right: 0; 
  top: 16px; 
  height: 1px; 
  background: var(--c-border);
}
.timeline-header .tick {
  grid-column: 2;
}
.tick { position: absolute; top: 0; font-size: 12px; color: #1F2937 !important; transform: translateX(-50%); font-weight: 800; letter-spacing: .2px; }
.tick span { color: #1F2937 !important; }
.tick::before {
  content: '';
  position: absolute; left: 50%; top: 14px; width: 1px; height: 10px; background: #94A3B8; transform: translateX(-0.5px);
}

.timeline-row {
  display: grid;
  grid-template-columns: var(--leftW) 1fr;
  gap: var(--gap);
  align-items: center;
  padding: 6px 0 2px;
}
.left { padding: 8px 10px; }
.left-title { display: flex; justify-content: space-between; align-items: center; }
.left-sub { font-size: 13px; color: #1F2937; margin-top: 3px; line-height: 1.3; }

.right { position: relative; }
.track { position: relative; padding: 0; margin: 0; }
.rail {
  height: 34px; background: var(--c-rail); border-radius: 17px; position: relative;
}
.bar {
  position: absolute; height: 30px; top: 2px; border-radius: 10px; display: inline-flex; align-items: center; gap: 6px; padding: 0 10px; color: #0B1220; overflow: visible; white-space: nowrap; line-height: 1; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.25);
}
.bar .bar-label { font-weight: 700; font-size: 12px; white-space: nowrap; overflow: visible; }
.bar .bar-label.small { font-size: 10px; }
.bar .bar-label.tiny { font-size: 9px; }
.bar .bar-extra { font-weight: 600; font-size: 10px; opacity: 0.8; margin-left: 4px; }
.bar.is-em { transform: translateY(0); }
.type-drive { background: linear-gradient(180deg, #60A5FA, var(--c-drive)); }
.type-drive .bar-label, .type-drive .bar-extra, .type-drive .bar-icon { color: #FFFFFF !important; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }

.type-scenic { background: linear-gradient(180deg, #34D399, var(--c-scenic)); }
.type-scenic .bar-label, .type-scenic .bar-extra, .type-scenic .bar-icon { color: #FFFFFF !important; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }

.type-meal { background: linear-gradient(180deg, #FEF3C7, #FDE68A); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.35); }
.type-meal .bar-label, .type-meal .bar-extra, .type-meal .bar-icon { color: #1F2937 !important; }

.type-rest { background: linear-gradient(180deg, #E2E8F0, var(--c-rest)); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.45); }
.type-rest .bar-label, .type-rest .bar-extra, .type-rest .bar-icon { color: #1F2937 !important; }

.type-sunset { background: linear-gradient(180deg, #FDBA74, var(--c-sunset)); }
.type-sunset .bar-label, .type-sunset .bar-extra, .type-sunset .bar-icon { color: #1F2937 !important; }

.type-night { background: linear-gradient(180deg, #E9D5FF, #DDD6FE); }
.type-night .bar-label, .type-night .bar-extra, .type-night .bar-icon { color: #1F2937 !important; }

.timeline-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}

.row-sep { 
  height: 1px; 
  background: var(--c-border); 
  margin: 16px 0 6px; 
}

/* 流程图样式 */
.route-flow { margin-top: 12px; }
.flow-container { 
  padding: 20px; 
}

.flow-list {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.flow-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 80px;
}

.flow-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--c-drive);
  border: 2px solid #FFFFFF;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.flow-dot.start, .flow-dot.end {
  background: #EF4444;
  width: 16px;
  height: 16px;
}

.flow-dot.scenic {
  background: var(--c-scenic);
}

.flow-content {
  text-align: center;
}

.flow-city {
  font-size: 13px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 2px;
}

.flow-day {
  font-size: 11px;
  font-weight: 600;
  color: var(--c-muted);
}

.flow-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  margin: 0 8px;
}

.arrow-line {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, var(--c-drive), transparent);
  position: relative;
}

.arrow-line::after {
  content: '';
  position: absolute;
  right: -6px;
  top: -2px;
  width: 0;
  height: 0;
  border-left: 6px solid var(--c-drive);
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
}

.arrow-info {
  font-size: 10px;
  font-weight: 600;
  color: var(--c-muted);
  white-space: nowrap;
}



/* 移动端设置固定2000px宽度 */
@media (max-width: 768px) {
  .itinerary-page {
    width: 2000px;
    min-width: 2000px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .container {
    width: 2000px;
    min-width: 2000px;
    padding: 20px 12px 80px;
    box-sizing: border-box;
  }
  
  body {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  html {
    overflow-x: auto;
  }
}

/* 详细行程样式 */
.detailed-itinerary { margin-top: 16px; }
.detailed-container { display: flex; flex-direction: column; gap: 24px; }

.detailed-day {
  padding: 24px;
  margin-bottom: 16px;
}

.day-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--c-border);
}

.day-number {
  background: linear-gradient(135deg, #3B82F6, #1E40AF);
  color: white;
  font-size: 18px;
  font-weight: 800;
  padding: 12px 16px;
  border-radius: 12px;
  min-width: 60px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.day-info { flex: 1; }

.day-title {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 8px 0;
}

.day-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.day-date, .day-weather, .day-distance {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--c-panel);
  color: var(--c-sub);
}

.day-content {
  display: grid;
  gap: 20px;
}

.content-title {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.highlights {
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #F59E0B;
}

.highlight-list {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.highlight-list li {
  position: relative;
  font-size: 14px;
  color: #1F2937;
  margin-bottom: 6px;
  padding-left: 8px;
}

.highlight-list li::before {
  content: '✨';
  position: absolute;
  left: -16px;
  top: 0;
}

.schedule {
  background: #F8FAFC;
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #3B82F6;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.schedule-time {
  background: var(--c-drive);
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 8px;
  min-width: 60px;
  text-align: center;
  white-space: nowrap;
}

.schedule-content { flex: 1; }

.schedule-title {
  font-size: 15px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 4px;
}

.schedule-desc {
  font-size: 13px;
  color: var(--c-sub);
  margin-bottom: 6px;
}

.schedule-tips {
  font-size: 12px;
  color: var(--c-muted);
  background: rgba(59, 130, 246, 0.1);
  padding: 6px 10px;
  border-radius: 6px;
  margin-top: 6px;
}

.tips-label {
  font-weight: 600;
  color: var(--c-drive);
}

.recommendations {
  background: linear-gradient(135deg, #ECFDF5, #D1FAE5);
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #10B981;
}

.rec-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.rec-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.rec-icon {
  font-size: 20px;
  width: 32px;
  text-align: center;
}

.rec-text { flex: 1; }

.rec-title {
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 2px;
}

.rec-desc {
  font-size: 12px;
  color: var(--c-sub);
  line-height: 1.4;
}

.accommodation {
  background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #EC4899;
}

.acc-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.acc-name {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
}

.acc-type {
  font-size: 13px;
  font-weight: 600;
  color: #EC4899;
}

.acc-tips {
  font-size: 12px;
  color: var(--c-sub);
  line-height: 1.4;
}

/* 详细模块响应式 */
@media (max-width: 768px) {
  .detailed-day { 
    padding: 16px; 
    margin-bottom: 12px;
  }
  .day-header { 
    flex-direction: column; 
    gap: 12px; 
    align-items: stretch; 
  }
  .day-number { 
    align-self: flex-start; 
    font-size: 16px;
    padding: 10px 12px;
  }
  .day-title {
    font-size: 18px;
  }
  .day-meta {
    gap: 8px;
  }
  .day-date, .day-weather, .day-distance {
    font-size: 12px;
  }
  .rec-grid { 
    grid-template-columns: 1fr; 
  }
  .schedule-item { 
    flex-direction: column; 
    gap: 8px; 
  }
  .schedule-time { 
    align-self: flex-start; 
    font-size: 11px;
    padding: 4px 8px;
  }
  .schedule-title {
    font-size: 14px;
  }
  .schedule-desc {
    font-size: 12px;
  }
  .content-title {
    font-size: 15px;
  }
  .rec-title {
    font-size: 13px;
  }
}

@media (max-width: 540px) {
  .detailed-day { 
    padding: 12px; 
  }
  .day-number {
    font-size: 14px;
    padding: 8px 10px;
  }
  .day-title {
    font-size: 16px;
  }
  .content-title {
    font-size: 14px;
  }
  .schedule-time {
    font-size: 10px;
    min-width: 50px;
  }
  .rec-item {
    padding: 8px;
  }
  .rec-icon {
    font-size: 16px;
    width: 24px;
  }
}
</style> 