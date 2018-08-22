window.onload = function() {
  let LeftContainer = {
    props: ['data'],
    methods: {
      drag(event) {
        let idx = event.target.id.substring(4, event.target.id.length);
        event.dataTransfer.setData('DATA', Number(idx));
      }
    },
    template: '<div>\
    <p v-for="(item, index) in data" draggable="true" class="menu-item" @dragstart="drag" :id="\'item\'+index">{{ item.name }}</p>\
    </div>'
  };
  let RowElement = {
    props: ['dishes', 'row'],
    data: ()=>{
      return {
        male: 0,
        female: 0
      }
    },
    methods: {
      sum(cla) {
        switch(cla) {
          case 'heat': return this.dishes[0].heat + this.dishes[1].heat + this.dishes[2].heat;
          case 'fat': return this.dishes[0].fat + this.dishes[1].fat + this.dishes[2].fat;
          case 'protein': return this.dishes[0].protein + this.dishes[1].protein + this.dishes[2].protein;
          default: return 0;
        }
      },
      drop(event, col) {
        event.preventDefault();
        console.log(col);
        let id = event.dataTransfer.getData('DATA');
        this.$emit('SetMenu' ,this.row, col, Number(id));
      },
      prevent(event) {
        event.preventDefault();
      },
      delete_(col) {
        this.$emit('Delete', this.row, col);
      }
    },
    template: '<tr>\
    <td style="width: 50px;" :class="{ odd1: row % 2, even1: !(row % 2)}">{{ row }}</td>\
    <td>\
      <ul>\
        <li style="border-bottom: solid;border-width: 0.5px;" @dragover="prevent" @drop="drop(this.event, 0)" @dblclick="delete_(0)"\
        :class="{ odd2: (row + 0) % 2, even2: !((row + 0)%2)}">{{ dishes[0].name }}</li>\
        <li style="border-bottom: solid;border-width: 0.5px;" @dragover="prevent" @drop="drop(this.event, 1)" @dblclick="delete_(1)"\
        :class="{ odd2: (row + 1) % 2, even2: !((row + 1)%2)}">{{ dishes[1].name }}</li>\
        <li @dragover="prevent" @drop="drop(this.event, 2)" @dblclick="delete_(2)" :class="{ odd2: (row + 2) % 2, even2: !((row + 2)%2)}">{{ dishes[2].name }}</li>\
      </ul>\
    </td>\
    <td :class="{sum: true, Red: sum(\'heat\') < 2926, odd3: row % 2, even3: !(row % 2) }">{{ sum("heat") }}</td>\
    <td :class="{sum: true, Red: sum(\'fat\') > 50, odd4: row % 2, even4: !(row % 2) }">{{ sum("fat") }} </td>\
    <td :class="{sum: true, odd5: row % 2, even5: !(row % 2)}">{{ sum("protein") }}</td>\
    <td style="width: 12%;" :class="{odd6: row % 2, even6: !(row % 2)}"><input v-model="male" placeholder="0"></td>\
    <td style="width: 12%;" :class="{odd6: row % 2, even6: !(row % 2)}"><input v-model="female" placeholder="0"></td>\
    <td :class="{sum: true, odd6: row % 2, even6: !(row % 2)}">{{ Number(male) + Number(female) }} </td>\
    </tr>'
  };
  let CountTable = {
    props: ['data'],
    data: ()=> {
      return {
        scheme: []
      }
    },
    created() {
      this.scheme = [];
      for(let i = 0; i < 6; ++i) {
        this.scheme.push([9, 9, 9]);
      }
    },
    methods: {
      foo(row, col, id) {
        //console.log(row, col, id);
        let arr = this.scheme[row-1];
        arr[col] = id;
        Vue.set(this.scheme, row-1, arr);
      },
      getDishes(itemlist) {
        return [this.data[itemlist[0]], this.data[itemlist[1]], this.data[itemlist[2]]];
      },
      del(row, col) {
        let arr = this.scheme[row-1];
        arr[col] = 9;
        Vue.set(this.scheme, row-1, arr);
      }
    },
    components: {
      'row-element': RowElement
    },
    template: '<div>\
    <table>\
    <tr>\
    <td class="tag t1">方案</td>\
    <td class="tag t2">菜品</td>\
    <td class="tag t3">热量</td>\
    <td class="tag t4">脂肪</td>\
    <td class="tag t5">蛋白质</td>\
    <td class="tag t6">男</td>\
    <td class="tag t7">女</td>\
    <td class="tag t8">一共</td>\
    </tr>\
    <row-element v-for="(item, index) in scheme" :dishes="getDishes(item)" \
    :key="index" :row="index+1" @SetMenu="foo" @Delete="del"></row-element>\
    </table></div>'
  };
  new Vue({
    el: '#app',
    data: {data},
    components: { 
      'left-container': LeftContainer,
      'count-table': CountTable
    }
  });
}