// import { FlatList, ImageBackground } from 'react-native';


// const demoStamps = [
// {id: 'l1', name: 'Chamundi Hill', collected: true, asset: require('./assets/generated_image_1.png')},
// {id: 'l2', name: 'Mysore Palace', collected: true, asset: require('./assets/generated_image_2.png')},
// {id: 'l3', name: 'St. Philomena', collected: false, asset: require('./assets/generated_image_3.png')},
// ];


// function HomeScreen({navigation}: any) {
// // In a real app, load user profile + stamps from AsyncStorage or backend
// const [stamps, setStamps] = useState(demoStamps);


// return (
// <SafeAreaView style={[styles.full, {backgroundColor: Colors.warmWhite}]}>
// <View style={styles.headerRow}>
// <Text style={styles.h2}>Your Stamp Book</Text>
// <Pressable onPress={() => navigation.navigate('Scan')} style={styles.scanIcon}>
// <Text style={{color: Colors.terracotta}}>Scan</Text>
// </Pressable>
// </View>


// <FlatList
// data={stamps}
// keyExtractor={(i) => i.id}
// contentContainerStyle={{padding: 16}}
// numColumns={2}
// renderItem={({item}) => (
// <Pressable style={styles.stampCard} onPress={() => {/* open detail */}}>
// <Image source={item.asset} style={styles.stampImage} />
// <Text style={styles.stampTitle}>{item.name}</Text>
// {item.collected ? <Text style={styles.collectedLabel}>Collected</Text> : <Text style={styles.missingLabel}>Locked</Text>}
// </Pressable>
// )}
// />
// </SafeAreaView>
// );
// }