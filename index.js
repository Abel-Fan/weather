let citys

$.ajax({
    url:"https://www.toutiao.com/stream/widget/local_weather/city/",
    type:"get",
    dataType:"jsonp",
    success:function(e){

        citys = e.data
        let str = ""
        for(key in citys){
            str+=`<h2>${key}</h2>`
            str+='<div class="con">'
            for(key2 in citys[key]){
                str+= `<div class="city">${key2}</div>`
            }
            str+="</div>"
        }
        $(str).appendTo($(".cityBox"))
    }
})


$(function(){
    $(".audioBtn").click(function(event){
        event.stopPropagation()
        let speech = window.speechSynthesis
        let speechset = new SpeechSynthesisUtterance()
        let text = $(".header span").text()+"当前温度"+$("#current_temperature").text() +"摄氏度" +","+$("#current_condition").text()+$("#wind").text()+"级"
     
        speechset.text= text

        speech.speak(speechset)
        
    })







    let cityBox = $(".cityBox")
    $(".header").click(function(event){
        cityBox.slideDown()
    })
    $(".search .btn").click(function(){
        cityBox.slideUp()
    })

    cityBox.on("touchstart",function(event){
        if(event.target.className=="city"){
            let city = event.target.innerText
            $.ajax({
                url:"https://www.toutiao.com/stream/widget/local_weather/data/",
                data:{'city':city},
                type:"get",
                dataType:"jsonp",
                success:function(e){
                    updata(e.data)
                }
            })


            cityBox.slideUp()
        }
    })
        
})

function updata(data){
    console.log(data)
    $(".header span").text(data.city)
    $("#aqi").text(data.weather.aqi)
    $("#quality_level").text(data.weather.quality_level)
    $("#current_temperature").text(data.weather.current_temperature)

    $("#wind").text(data.weather.wind_direction+"  "+data.weather.weather_icon_id)
    $("#high_low_temperature").text(data.weather.dat_high_temperature+"/"+data.weather.dat_low_temperature)
    $("#day_condition").text(data.weather.day_condition)

    $("#dat_weather_icon_id").attr("src",`img/${data.weather.dat_weather_icon_id}.png`)

    $("#tomorrow_high_low_temperature").text(data.weather.tomorrow_high_temperature+"/"+data.weather.tomorrow_low_temperature)

    $("#tomorrow_condition").text(data.weather.tomorrow_condition)

    $("#tomorrow_weather_icon_id").attr("src",`img/${data.weather.tomorrow_weather_icon_id}.png`)


    let str = ""
    for(obj of data.weather.hourly_forecast){
        str+=
        `<div class="box">
            <div> <span>${obj.hour}</span> :00</div>
            <img src="img/${obj.weather_icon_id}.png" alt="">
            <div><span>${obj.temperature}</span>°</div>
        </div>`
    }

    $(".hours .con").html(str)
    let str1 = ""
    let x = []
    let high = []
    let low = []

    let weeknum = ['日',"一",'二',"三","四","五","六"]
    for(obj of data.weather.forecast_list){
        let date = new Date(obj.date)
        let day = date.getDay()  //星期几  0 1 2 3
        x.push(obj.date)
        high.push(obj.high_temperature)
        low.push(obj.low_temperature)
        str1+=`
        <div class="box">
            <div>星期${weeknum[day]}</div>
            <div>${obj.date}</div>
            <img src="img/${obj.weather_icon_id}.png" alt="">
            <div>${obj.high_temperature}°</div>
            <div>${obj.low_temperature}°</div>
            <div>${obj.condition}</div>
            <div>${obj.wind_direction}</div>
            <div>${obj.wind_level}级</div>
        </div>`
    }   
    $(".week .con").html(str1)
    var myChart = echarts.init($(".canvas")[0]);
    console.log(x)
    var option = {
        xAxis: {
            data: x,
            show:false
        },
        grid:{
            left:0,
            right:0,
        },
        yAxis: {
            show:false
        },
        series: [
            {
                name: '最高气温',
                type: 'line',
                data: high
            },{
                name: '最低气温',
                type: 'line',
                data: low
            }
        ]
    };
    myChart.setOption(option);


}


$.ajax({
    url:"https://www.toutiao.com/stream/widget/local_weather/data/",
    data:{'city':'太原'},
    type:"get",
    dataType:"jsonp",
    success:function(e){
        updata(e.data)
    }
})

