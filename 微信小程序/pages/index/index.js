// index.js
/**/
const App = getApp()

const { connect } = require('../../utils/mqtt.js')

const mqttHost = 'broker.emqx.io'//mqtt服务器域名
const mqttPort = 8084 //mqtt服务器端口
const deviceSubTopic = 'ChaoCaiJiByZYJ_Sub' //设备订阅Topic（小程序发布命令端）
const devicePubTopic = 'ChaoCaiJiByZYJ_Pub' //设备发布Topic（小程序接收命令端）

const mpSubTopic = devicePubTopic
const mpPubTopic = deviceSubTopic

Page({
  data: {
    client:null,
    Heat:false,
    Alarm:false,
    Year:2024,
    Month:4,
    Day:29,
    Hour:19,
    Minute:50,
    Second:0,
    Syear:2024,
    Smonth:4,
    Sday:27,
    Shour:19,
    Sminute:3,
    Ssecond:0,
    Menu:1,
    MenuName:"爆炒午餐肉",
    Start:0
  },
  onDefaultButtonClick1(){//年份加
    let n = this.data.Syear
    let nm = this.data.Smonth
    let nd = this.data.Sday
    n=n+1
    if(nm==2&&n%4==0&&n%400!=0){if(nd>29)nd=29}
    else if((nm==2&&n%4==0&&n%400==0)||(nm==2&&n%4!=0)){if(nd>28)nd=28}
    this.setData({Sday:nd})
    this.setData({Syear:n})
  },
  onDefaultButtonClick2(){//年份减
    let n = this.data.Syear
    let nm = this.data.Smonth
    let nd = this.data.Sday
    n=n-1
    if(nm==2&&n%4==0&&n%400!=0){if(nd>29)nd=29}
    else if((nm==2&&n%4==0&&n%400==0)||(nm==2&&n%4!=0)){if(nd>28)nd=28}
    this.setData({Sday:nd})
    this.setData({Syear:n})
  },
  onDefaultButtonClick3(){//月份加
    let n = this.data.Smonth
    let nd = this.data.Sday
    let ny = this.data.Syear
    n=n+1
    if(n>12)n=1
    if(n==1||n==3||n==5||n==7||n==8||n==10||n==12){if(nd>31)nd=31}
    else if(n==4||n==6||n==9||n==10||n==11){if(nd>30)nd=30}
    else if(n==2&&ny%4==0&&ny%400!=0){if(nd>29)nd=29}
    else if((n==2&&ny%4==0&&ny%400==0)||(n==2&&ny%4!=0)){if(nd>28)nd=28}
    this.setData({Smonth:n})
    this.setData({Sday:nd})
  },
  onDefaultButtonClick4(){//月份减
    let n = this.data.Smonth
    let nd = this.data.Sday
    let ny = this.data.Syear
    n=n-1
    if(n<1)n=12
    if(n==1||n==3||n==5||n==7||n==8||n==10||n==12){if(nd>31)nd=31}
    else if(n==4||n==6||n==9||n==10||n==11){if(nd>30)nd=30}
    else if(n==2&&ny%4==0&&ny%400!=0){if(nd>29)nd=29}
    else if((n==2&&ny%4==0&&ny%400==0)||(n==2&&ny%4!=0)){if(nd>28)nd=28}
    this.setData({Smonth:n})
    this.setData({Sday:nd})
  },
  onDefaultButtonClick5(){//日数加
    let ny = this.data.Syear
    let nm = this.data.Smonth
    let n = this.data.Sday
    n=n+1
    if(nm==1||nm==3||nm==5||nm==7||nm==8||nm==10||nm==12){if(n>31)n=1}
    else if(nm==4||nm==6||nm==9||nm==10||nm==11){if(n>30)n=1}
    else if(nm==2&&ny%4==0&&ny%400!=0){if(n>29)n=1}
    else if((nm==2&&ny%4==0&&ny%400==0)||(nm==2&&ny%4!=0)){if(n>28)n=1}
    this.setData({Sday:n})
  },
  onDefaultButtonClick6(){//日数减
    let ny = this.data.Syear
    let nm = this.data.Smonth
    let n = this.data.Sday
    n=n-1
    if(n<1){
      if(nm==1||nm==3||nm==5||nm==7||nm==8||nm==10||nm==12)n=31
      else if(nm==4||nm==6||nm==9||nm==10||nm==11)n=30
      else if(nm==2&&ny%4==0&&ny%400!=0)n=29
      else if((nm==2&&ny%4==0&&ny%400==0)||(nm==2&&ny%4!=0))n=28
    }
    this.setData({Sday:n})
  },
  onDefaultButtonClick7(){//小时数加
    let n = this.data.Shour
    if(n>=23)n=0
    else n=n+1
    this.setData({Shour:n})
  },
  onDefaultButtonClick8(){//小时数减
    let n = this.data.Shour
    if(n<=0)n=23
    else n=n-1
    this.setData({Shour:n})
  },
  onDefaultButtonClick9(){//分钟数加
    let n = this.data.Sminute
    if(n>=59)n=0
    else n=n+1
    this.setData({Sminute:n})
  },
  onDefaultButtonClick10(){//分钟数减
    let n = this.data.Sminute
    if(n<=0)n=59
    else n=n-1
    this.setData({
      Sminute:n
    })
  },
  onDefaultButtonClick11(){//菜单加
    let n = this.data.Menu
    let str = this.data.MenuName
    n=n+1
    if(n>3)n=1
    if(n==3){str="油炸不拿拿"}
    else if(n==2){str="八足福岛鱼"}
    else if(n==1){str="爆炒午餐肉"}
    this.setData({Menu:n})
    this.setData({MenuName:str})
  },
  onDefaultButtonClick12(){//菜单减
    let n = this.data.Menu
    let str = this.data.MenuName
    n=n-1
    if(n<1)n=3
    if(n==3){str="油炸不拿拿"}
    else if(n==2){str="八足福岛鱼"}
    else if(n==1){str="爆炒午餐肉"}
    this.setData({Menu:n})
    this.setData({MenuName:str})
  },
  onDefaultButtonClick13(){
  let str=JSON.stringify({
    $year:this.data.Syear-2000,
    $month:this.data.Smonth,
    $day:this.data.Sday,
    $hour:this.data.Shour,
    $minute:this.data.Sminute,
    $Menu:this.data.Menu,
    $heat:this.data.Heat
  })
  console.log(str)
    this.data.client.publish(mpPubTopic,str,function (err){
      if(!err){
        console.log("准备开始做菜(*╹▽╹*)");
      }
    })
  wx.showToast({
    title: '准备做菜!OwO',
    icon: 'loading',
    mask:true,
    duration: 2000
  })
  },
  onHeatChange(event){
    const that = this
    console.log(event.detail.value);
    const sw = event.detail.value
    that.setData({Heat:sw})
  },
  onAlarmChange(event){
    const that = this
    console.log(event.detail.value);
    const sw = event.detail.value
    that.setData({Alarm:sw})
    if(sw){
      that.data.client.publish(mpPubTopic,JSON.stringify({
        target:"Alarm",
        value:1
      }),function (err){
        if(!err){
          console.log("成功下发指令!_报警(*╹▽╹*)");
        }
      })
    }else{
      that.data.client.publish(mpPubTopic,JSON.stringify({
        target:"Alarm",
        value:0
      }),function (err){
        if(!err){
          console.log("成功下发指令!_不报警(*╹▽╹*)");
        }
      })
    }
  },
  onShow(){
    const that = this
    that.setData({
      //wxs实际上是wxss => wss实际上就是拥有SSL加密通信的websocketed的通信协议
      client:connect('wxs://broker.emqx.io:8084/mqtt')
    })
    that.data.client.on('connect',function(param){
      console.log("成功连接到MQTT服务器~(=w=)~");
      wx.showToast({
        title:'连接成功~(=w=)',
        icon:'success',
        mask:true,
        duration:3000
      })
    })
    that.data.client.subscribe(mpSubTopic,function(err){
      if(!err)
        console.log('成功订阅数据上行数据(๑•̀ㅂ•́)و✧')
    })
    that.data.client.on('message',function(topic, message){
      console.log(topic);
      console.log(message);
      //message是16进制的buffer字节流
      let DataFromDev = {}
      try {
        DataFromDev = JSON.parse(message)
        console.log('(#^.^#)JSON解析到的数据为',DataFromDev);
        that.setData({
          Year:DataFromDev.Year,
          Month:DataFromDev.Month,
          Day:DataFromDev.Day,
          Hour:DataFromDev.Hour,
          Minute:DataFromDev.Minute,
          Second:DataFromDev.Second
        })
      } catch (error) {
        // console.log(error);
        console.log('JSON解析失败了啊啊啊啊啊w(ﾟДﾟ)w',error);
      }
    })
  },
})