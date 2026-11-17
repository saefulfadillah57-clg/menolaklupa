
/* MENOLAK LUPA 1888 - APP.JS FIX */
'use strict';

// Tunggu hingga komponen model-viewer siap digunakan.
await customElements.whenDefined('model-viewer');

const scenes = [
  {
    id:'01',
    title:'Banten Menjelang 1888',
    subtitle:'Prolog · Kehidupan masyarakat',
    intro:'Banten memiliki kehidupan masyarakat yang kuat dengan tradisi dan nilai keagamaan. Namun, kehidupan masyarakat mulai diwarnai tekanan akibat kebijakan pemerintahan kolonial.',
    models:[
      ['1.Rumah_Tradisional_Banten_1888_LowPoly.glb','Rumah tradisional Banten'],
      ['2.Rumah_Tradisional_Banten_1888.glb','Rumah tradisional Banten - alternatif'],
      ['3.Kampung_Banten_1888_LowPoly_Optimized-compressed.glb','Kampung Banten'],
      ['4.Banten_Village_Musala_WebAR-compressed.glb','Desa dan musala']
    ]
  },
  {
    id:'02',
    title:'Letusan Krakatau 1883',
    subtitle:'Bencana alam · Latar sejarah',
    intro:'Pada tahun 1883, Gunung Krakatau meletus dahsyat dan mengguncang kawasan Selat Sunda. Peristiwa ini menjadi bagian penting dari latar kehidupan masyarakat Banten pada masa itu.',
    models:[
      ['6.Krakatau_1883_LowPoly_Assemblr-compressed.glb','Letusan Krakatau 1883']
    ]
  },
  {
    id:'03',
    title:'Kehidupan Pascabencana',
    subtitle:'Masyarakat · Lingkungan',
    intro:'Setelah bencana, masyarakat menghadapi perubahan lingkungan dan kesulitan kehidupan. Mereka berusaha membangun kembali kehidupan di tengah kondisi yang berat.',
    models:[
      ['7.Banten_1883_Krakatau_Aftermath_LowPoly-compressed.glb','Kondisi pascabencana'],
      ['9.Kerbau_dan_Kehidupan_Petani_Enhanced-compressed.glb','Kerbau dan kehidupan petani']
    ]
  },
  {
    id:'04',
    title:'Tekanan Pemerintahan Kolonial',
    subtitle:'Bangunan · Pajak · Kekuasaan',
    intro:'Kebijakan pemerintahan kolonial memengaruhi kehidupan masyarakat. Tekanan ekonomi dan persoalan sosial menjadi bagian dari suasana Banten menjelang 1888.',
    models:[
      ['5.Dutch_Colonial_Building_Complete_WebAR-compressed.glb','Bangunan kolonial'],
      ['8.Penarikan_Pajak_Kolonial_Banten_1888.glb','Penarikan pajak kolonial'],
      ['14.Cilegon_1888_Dutch_Colonial_Residence-compressed.glb','Kediaman pejabat kolonial']
    ]
  },
  {
    id:'05',
    title:'Ulama dan Konsolidasi',
    subtitle:'Musala · Pertemuan · Perlengkapan',
    intro:'Ulama memiliki peran penting dalam kehidupan masyarakat Banten. Ruang keagamaan dan pertemuan masyarakat menjadi bagian dari gambaran tumbuhnya kesadaran menghadapi ketidakadilan.',
    models:[
      ['10.Musala_Jombang_Tengah_1888_Banten-compressed.glb','Musala Jombang Tengah'],
      ['11A.Banten_1888_Ulama_Scene_AssemblrWebAR.glb','Adegan ulama A'],
      ['11B.Banten_1888_Ulama_Scene_AssemblrWebAR.glb','Adegan ulama B'],
      ['12.banten_1888_meeting_scene.glb','Pertemuan masyarakat'],
      ['13.Banten_1888_Keris_Golok_Artifacts.glb','Artefak keris dan golok'],
      ['15.Konsolidasi_Sebelum_Fajar_1888_3D.glb','Konsolidasi sebelum fajar']
    ]
  },
  {
    id:'06',
    title:'Mobilisasi Pasukan Kolonial',
    subtitle:'Pengerahan pasukan',
    intro:'Ketegangan menjelang Geger Cilegon semakin meningkat. Kekuatan militer kolonial menjadi bagian dari situasi yang melatarbelakangi peristiwa 1888.',
    models:[
      ['16.Banten_1888_Colonial_Troop_Mobilization-compressed.glb','Mobilisasi pasukan kolonial']
    ]
  },
  {
    id:'07',
    title:'Perlawanan dan Penindasan',
    subtitle:'Geger Cilegon 1888',
    intro:'Pada tahun 1888, perlawanan terhadap pemerintahan kolonial meletus di Cilegon. Peristiwa tersebut diikuti tindakan penindasan oleh pihak kolonial.',
    models:[
      ['17.banten_1888_historical_scene.glb','Perlawanan Geger Cilegon'],
      ['18.banten_historical_scene_1888.glb','Penindasan kolonial']
    ]
  },
  {
    id:'08',
    title:'Pengasingan dan Epilog',
    subtitle:'Pemberangkatan · Kedatangan · Menolak Lupa',
    intro:'Peristiwa Geger Cilegon membawa konsekuensi berat bagi sejumlah tokoh dan masyarakat yang terlibat. Jejak perjuangan mereka menjadi bagian dari ingatan sejarah Banten.',
    models:[
      ['19.banten_exile_historical_scene.glb','Adegan pengasingan'],
      ['20.banten_exile_1888_scene-compressed.glb','Pengasingan dan pemberangkatan'],
      ['21.Bantenese_Exiles_Arrival_1888-compressed.glb','Kedatangan di wilayah pengasingan']
    ]
  }
];

const $ = id => document.getElementById(id);

const required = [
  'scene-nav','model-select','model-status','model-host',
  'viewer-message','scene-kicker','scene-title',
  'scene-subtitle','story-title','story-text',
  'scene-count','prev-scene','next-scene','reset-camera'
];

const missing = required.filter(id => !$(id));

if (missing.length) {
  console.error('Elemen HTML tidak ditemukan:', missing);
} else {

  const nav = $('scene-nav');
  const select = $('model-select');
  const status = $('model-status');
  const host = $('model-host');
  const message = $('viewer-message');

  let sceneIndex = 0;
  let modelIndex = 0;
  let loadToken = 0;
  let viewer = null;

  function say(text,state='') {
    status.textContent = text;
    status.className = 'status ' + state;
    message.textContent = text;
  }

  function createViewer() {
    const el = document.createElement('model-viewer');

    el.setAttribute('camera-controls','');
    el.setAttribute('touch-action','pan-y');
    el.setAttribute('shadow-intensity','1');
    el.setAttribute('exposure','1');
    el.setAttribute('camera-orbit','auto auto auto');
    el.setAttribute('camera-target','auto auto auto');

    el.setAttribute('ar','');
    el.setAttribute('ar-modes','scene-viewer webxr quick-look');
    el.setAttribute('ar-placement','floor');
    el.setAttribute('ar-scale','auto');

    el.alt = 'Rekonstruksi 3D sejarah Banten';

    const ar = document.createElement('button');
    ar.slot = 'ar-button';
    ar.className = 'ar-button';
    ar.textContent = 'LIHAT DI RUANG SAYA · AR';

    el.appendChild(ar);

    return el;
  }

  function renderNav() {
    nav.replaceChildren();

    scenes.forEach((scene,index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'scene-card';

      button.setAttribute(
        'aria-current',
        index === sceneIndex ? 'true' : 'false'
      );

      const number = document.createElement('span');
      number.className = 'scene-number';
      number.textContent = 'ADEGAN ' + scene.id;

      const title = document.createElement('strong');
      title.textContent = scene.title;

      button.append(number,title);
      button.addEventListener('click',() => chooseScene(index));
      nav.append(button);
    });
  }

  function loadModel(index) {
    const scene = scenes[sceneIndex];

    modelIndex = Math.max(
      0,
      Math.min(scene.models.length - 1,index)
    );

    const [filename,label] = scene.models[modelIndex];
    const token = ++loadToken;

    select.value = String(modelIndex);
    say('Menyiapkan model: ' + label);

    if (viewer) {
      viewer.remove();
      viewer = null;
    }

    host.replaceChildren();

    viewer = createViewer();
    host.appendChild(viewer);

    viewer.addEventListener('load',() => {
      if (token !== loadToken) return;

      try {
        viewer.updateFraming();
        viewer.cameraOrbit = 'auto auto auto';
        viewer.cameraTarget = 'auto auto auto';
      } catch(error) {
        console.warn('Kamera:',error);
      }

      say('Model berhasil dimuat','ok');

      message.textContent =
        'Model siap · geser untuk memutar, scroll untuk zoom';
    });

    viewer.addEventListener('error',event => {
      if (token !== loadToken) return;

      console.error('Gagal memuat model:',filename,event);

      say(
        'Model gagal dimuat. Periksa nama file dan folder assets/models.',
        'error'
      );
    });

    const safeName = encodeURIComponent(filename)
      .replace(/%2E/gi,'.');

    // URL HTTPS absolut untuk akses model dari Scene Viewer.
    const modelUrl = new URL(
      'assets/models/' + safeName,
      window.location.href
    ).href;

    console.info('URL model untuk 3D/AR:',modelUrl);

    viewer.src = modelUrl;
    viewer.alt = 'Rekonstruksi 3D: ' + label;

    setTimeout(() => {
      if (
        token === loadToken &&
        status.textContent.startsWith('Menyiapkan model:')
      ) {
        say(
          'Model belum merespons. Periksa pemuat 3D atau file GLB.',
          'error'
        );
      }
    },20000);
  }

  function chooseScene(index) {
    sceneIndex = Math.max(
      0,
      Math.min(scenes.length - 1,index)
    );

    const scene = scenes[sceneIndex];

    $('scene-kicker').textContent = 'ADEGAN ' + scene.id;
    $('scene-title').textContent = scene.title;
    $('scene-subtitle').textContent = scene.subtitle;
    $('story-title').textContent = scene.title;
    $('story-text').textContent = scene.intro;
    $('scene-count').textContent = scene.id + ' / 08';

    select.replaceChildren();

    scene.models.forEach(([filename,label],index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = label;
      select.append(option);
    });

    renderNav();
    loadModel(0);

    $('prev-scene').disabled = sceneIndex === 0;

    $('next-scene').textContent =
      sceneIndex === scenes.length - 1
        ? 'Kembali ke awal ↺'
        : 'Adegan berikutnya →';
  }

  select.addEventListener('change',() => {
    loadModel(Number(select.value));
  });

  $('reset-camera').addEventListener('click',() => {
    if (!viewer) return;

    try {
      viewer.updateFraming();
      viewer.cameraOrbit = 'auto auto auto';
      viewer.cameraTarget = 'auto auto auto';
      viewer.jumpCameraToGoal();
    } catch(error) {
      console.warn('Reset kamera:',error);
    }
  });

  $('prev-scene').addEventListener('click',() => {
    chooseScene(sceneIndex - 1);
  });

  $('next-scene').addEventListener('click',() => {
    chooseScene(
      sceneIndex === scenes.length - 1 ? 0 : sceneIndex + 1
    );
  });

  window.addEventListener('resize',() => {
    if (viewer && viewer.loaded) {
      try {
        viewer.updateFraming();
      } catch(error) {}
    }
  });

  chooseScene(0);
}
