import Prayer from './prayer'
import fajr from '../assets/fajr-prayer.png'
import dhuhr from '../assets/dhhr-prayer-mosque.png'
import aser from '../assets/asr-prayer-mosque.png'
import sunset from '../assets/sunset-prayer-mosque.png'
import night from '../assets/night-prayer-mosque.png'
import { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import "moment/dist/locale/ar-dz"
import algeria_cities from '../algeria_cities'
moment.locale("ar")
function MainContent() {
    const [remainingTime, setRemainingTime] = useState("");
    const [nextPrayerIndex, setNextPrayerIndex] = useState(1);
    const [day, setDay] = useState("")
    const [timer, setTimer] = useState(10)
    const [selectedCity, setSelectedCity] = useState({
        ar_name: "تقرت",
        name: "touggourt"
    })
    const [timings, setTimings] = useState({
        "Fajr": "06:12",
        "Dhuhr": "12:41",
        "Asr": "15:24",
        "Maghrib": "17:43",
        "Isha": "19:06",
    });
    const url = `https://api.aladhan.com/v1/timingsByCity?country=DZA&city=${selectedCity.name}`
    const getTiming = async () => {
        const res = await axios.get(url)
        setTimings(res.data.data.timings)
    }
    const handelSelectCity = (e) => {
        const selectedName = e.target.value;
        console.log(selectedName)
        const selectedCityObject = algeria_cities.find(city =>
            city.name === selectedName
        );
        setSelectedCity(selectedCityObject);
    }

    useEffect(() => {
        let interval = setInterval(() => {
            setupCountdownTimer();
        }, 1000);
        const t = moment()
        setDay(t.format("Do MMM YYYY | h:mm"))
        return () => {
            clearInterval(interval)
        }
    }, [timings])
    const prayersArray = [
        { key: "Fajr", displayName: "الفجر" },
        { key: "Dhuhr", displayName: "الظهر" },
        { key: "Asr", displayName: "العصر" },
        { key: "Sunset", displayName: "المغرب" },
        { key: "Isha", displayName: "العشاء" },
    ];
    useEffect(() => {
        getTiming()
    }, [selectedCity])
    const setupCountdownTimer = () => {
        const momentNow = moment()
        let prayerIndex = 1;
        if (
            momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
        ) {
            prayerIndex = 1;
        } else if (
            momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
        ) {
            prayerIndex = 2;
        } else if (
            momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
        ) {
            prayerIndex = 3;
        } else if (
            momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
        ) {
            prayerIndex = 4;
        } else {
            prayerIndex = 0;
        }
        setNextPrayerIndex(prayerIndex);
        //
        const nextPrayerObject = prayersArray[prayerIndex];
        const nextPrayerTime = timings[nextPrayerObject.key];
        const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

        let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

        if (remainingTime < 0) {
            const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
            const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
                moment("00:00:00", "hh:mm:ss")
            );

            const totalDiffernce = midnightDiff + fajrToMidnightDiff;

            remainingTime = totalDiffernce;
        }

        const durationRemainingTime = moment.duration(remainingTime);

        setRemainingTime(
            `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
        );
    }
    return (
        <section className='flex flex-col justify-center items-center p-10'>
            <div className="grid grid-rows-1 grid-cols-3 gap-x-5 border-b border-solid border-[#eee] py-5">
                <div>
                    <h2>{day}</h2>
                    <h2>{selectedCity.ar_name}</h2>
                </div>
                <div>
                    <h2>متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
                    <h2>{remainingTime}</h2>
                </div>
                <div className='flex justify-center items-center gap-5 flex-col'>
                    <select name="" id="" onChange={handelSelectCity} className='border border-solid border-black w-full rounded-md outline-none p-2'>
                        <option selected disabled>المدينة</option>
                        {algeria_cities.map((wilay) => (
                            <option value={wilay.name} key={wilay.code}>
                                {wilay.ar_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='flex justify-center items-center gap-5 p-5 flex-col w-full md:flex-row border-t border-solid border-[#333]'>
                <Prayer src={fajr} name={"الفجر"} time={timings.Fajr} />
                <Prayer src={dhuhr} name={"الظهر"} time={timings.Dhuhr} />
                <Prayer src={aser} name={"العصر"} time={timings.Asr} />
                <Prayer src={sunset} name={"المغرب"} time={timings.Maghrib} />
                <Prayer src={night} name={"العشاء"} time={timings.Isha} />
            </div>
        </section>
    )
}

export default MainContent