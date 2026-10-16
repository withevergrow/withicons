// with icons — morph sequence presets (forge/LOADERS.md "Morph sequences"). Each is a chain of library icons that keep
// turning into one another while something loads; pre-rendered in every style like the loaders (group "morph").
// The Loader Studio starts from these; any chain of icons works at runtime (morph() / <with-loader morph="…">).
export default [
  { name: 'morph-upload', title: 'Upload', icons: ['file', 'cloud-upload', 'check-circle'], effect: 'slide-up', hold: 1.1, intent: 'a file travels to the cloud and lands safely', aliases: ['uploading', 'upload-sequence', 'file-to-cloud'] },
  { name: 'morph-download', title: 'Download', icons: ['cloud', 'cloud-download', 'file-check'], effect: 'drop', hold: 1.1, intent: 'something comes down from the cloud to you', aliases: ['downloading', 'download-sequence', 'cloud-to-file'] },
  { name: 'morph-payment', title: 'Payment', icons: ['credit-card', 'wallet', 'badge-check'], effect: 'flip', hold: 1.2, intent: 'the card is charged and the payment confirmed', aliases: ['paying', 'checkout-loader', 'payment-processing'] },
  { name: 'morph-ai', title: 'AI thinking', icons: ['sparkles', 'brain', 'bot', 'message-circle-more'], effect: 'bloom', hold: 1.1, intent: 'an assistant thinks, then answers', aliases: ['ai-loader', 'generating', 'assistant-thinking'] },
  { name: 'morph-send', title: 'Send message', icons: ['pencil', 'mail', 'send', 'mail-check'], effect: 'slide-left', hold: 1, intent: 'a message is written, sealed, sent and delivered', aliases: ['sending', 'send-sequence', 'mail-sending'] },
  { name: 'morph-secure', title: 'Securing', icons: ['key', 'lock', 'shield-check'], effect: 'spin', hold: 1.2, intent: 'keys turn and the connection is secured', aliases: ['securing', 'encrypting', 'secure-sequence'] },
  { name: 'morph-search', title: 'Searching', icons: ['search', 'scan-search', 'file-search', 'check'], effect: 'zoom', hold: 1, intent: 'looking everywhere until it is found', aliases: ['searching-sequence', 'finding', 'lookup-loader'] },
  { name: 'morph-weather', title: 'Weather', icons: ['sun', 'cloud-sun', 'cloud-rain', 'rainbow'], effect: 'fade', hold: 1.2, intent: 'the forecast is on its way', aliases: ['forecast-loader', 'weather-sequence', 'sky-changing'] },
  { name: 'morph-delivery', title: 'Delivery', icons: ['package', 'truck', 'home'], effect: 'slide-left', hold: 1.2, intent: 'the parcel is packed, on the road and home', aliases: ['shipping-loader', 'order-tracking', 'delivery-sequence'] },
  { name: 'morph-music', title: 'Music', icons: ['music-note', 'headphones', 'audio-waveform', 'disc'], effect: 'bloom', hold: 1, intent: 'the track is loading, the beat is coming', aliases: ['audio-loader', 'music-sequence', 'buffering-music'] },
  { name: 'morph-photo', title: 'Photo', icons: ['camera', 'image', 'sparkles'], effect: 'zoom', hold: 1.1, intent: 'a photo is taken, developed and enhanced', aliases: ['image-processing', 'photo-sequence', 'enhancing'] },
  { name: 'morph-build', title: 'Build', icons: ['wrench', 'settings', 'rocket'], effect: 'spin', hold: 1.1, intent: 'it is built, tuned and launched', aliases: ['building', 'deploying', 'build-sequence'] },
  { name: 'morph-diwali', title: 'Diwali', icons: ['diya', 'sparkler', 'firecracker', 'rangoli-pattern'], effect: 'bloom', hold: 1.1, intent: 'lamps, sparklers and colour: Diwali is loading', aliases: ['diwali-sequence', 'festival-of-lights', 'deepavali-loader'] },
  { name: 'morph-winter', title: 'Winter holidays', icons: ['snowflake', 'christmas-tree', 'gift', 'star'], effect: 'drop', hold: 1.1, intent: 'snow, the tree, presents and the star on top', aliases: ['christmas-sequence', 'holiday-season', 'winter-loader'] },
  { name: 'morph-celebrate', title: 'Celebrate', icons: ['party-popper', 'gift', 'cake', 'heart'], effect: 'bloom', hold: 1, intent: 'a little party while you wait', aliases: ['celebration-loader', 'birthday-sequence', 'party-sequence'] },
]
