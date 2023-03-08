import dummyData from "./dummyData.js"

export default class Api {
	// getData() {
	// 	// uncomment this part in presence of back-end
	// 	const response = await fetch("api endpoint")
	// 	const result = await response.json()
	//     if(result.isOk)
	//         return result.json()
	//     else alert( "error on loading initial data" )
	// }
	getData() {
		return dummyData.events
	}
}
