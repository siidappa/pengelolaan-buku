let bukuItems = [];
let itemBukuFilter = null;

const __formBuku__ = document.querySelector('#formBuku');
const __buttonSearch__ = document.querySelector('#buttonSearch');
const __buttonTambahBaru__ = document.querySelector('#buttonAddBaru');
const __buttonDibatalkan__ = document.querySelector('#buttonDiscard');
const __formWrapper__ = document.querySelector('#__formWrapper__');
const __inputBukuId__ = document.querySelector('#bukuId');
const __inputJudul__ = document.querySelector('#inputJudulBuku');
const __inputPenulisBuku__ = document.querySelector('#inputPenulisBuku');
const __inputTahunBuku__ = document.querySelector('#inputTahunPenulisanBuku');
const __inputBukuSelesaiBaca__ = document.querySelector('#inputBukuSelesaiBaca');

window.addEventListener('load', function() {
    const __serialData__ = localStorage.getItem('buku-item');
    const data = JSON.parse(__serialData__) || [];
    bukuItems = data;
    rendering();
});

__buttonTambahBaru__.addEventListener('click', function() {
    __formWrapper__.classList.remove('hidden');
});
__buttonDibatalkan__.addEventListener('click', function() {
    __formWrapper__.classList.add('hidden');;
});

__buttonSearch__.addEventListener('click', function() {
    const __inputPencarian__ = document.querySelector('#querySearch');
    const querySearch = __inputPencarian__.value.toLowerCase();

    // Logik
    if ( querySearch ) {
        const __terfilter__ = bukuItems.filter((bukuItem) => {
            return bukuItem.title.toLowerCase().includes(querySearch);
        });
        itemBukuFilter = __terfilter__;
    } else {
        itemBukuFilter = null;
    }
    rendering();
})

__formBuku__.addEventListener('submit', function() {
    const __id__ = +__inputBukuId__.value;
    const __judulBuku__ = __inputJudul__.value;
    const __penulisBuku__ = __inputPenulisBuku__.value;
    const __tahunBuku__ = __inputTahunBuku__.value;
    const __bukuSelesai__ = __inputBukuSelesaiBaca__.checked;

    const bukuItem = {
        id: __id__ || +new Date(),
        title: __judulBuku__,
        author: __penulisBuku__,
        year: __tahunBuku__,
        isComplete: __bukuSelesai__
    }
    // Logik
    if(__id__) {
        const indexBuku = bukuItems.findIndex(buku => buku.id === __id__);
        bukuItems[indexBuku] = bukuItem;
        __formWrapper__.classList.add('hidden');
    } else {
        bukuItems.push(bukuItem);
    }

    __inputBukuId__.value = '';
    __inputJudul__.value = '';
    __inputPenulisBuku__.value = '';
    __inputTahunBuku__.value = '';
    __inputBukuSelesaiBaca__.checked = false;

    simpanDataKeStorage();
    rendering();
});

function hapusBuku(id) {
    if(confirm("Apakah kamu yakin ingin mengahapusnya ??")) {
        const indexBuku = bukuItems.findIndex(buku => buku.id === id);
        bukuItems.splice(indexBuku, 1);

        simpanDataKeStorage();
        rendering();
    }
}

function perbaharuiBuku(id) {
    const indexBuku = bukuItems.findIndex(book => book.id === id);
    const buku = bukuItems[indexBuku];

    __inputBukuId__.value = buku.id;
    __inputJudul__.value = buku.title;
    __inputPenulisBuku__.value = buku.author;
    __inputTahunBuku__.value = buku.year;
    __inputBukuSelesaiBaca__.checked = buku.isComplete;

    __formWrapper__.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

function pindahkanBuku(id) {
    const indexBuku = bukuItems.findIndex(book => book.id === id);
    bukuItems[indexBuku].isComplete = !bukuItems[indexBuku].isComplete;

    simpanDataKeStorage();
    rendering();
};

function simpanDataKeStorage() {
    const __serialData__ = JSON.stringify(bukuItems);
    localStorage.setItem("buku-item", __serialData__);
};

function hapusElementBuku() {
    const elementBuku = document.getElementsByTagName('article');
    while ( elementBuku.length > 0 ) {
        elementBuku[0].parentNode.removeChild(elementBuku[0]);
    }
};

function apakahListKosong(items, listElementBukuSelesai, listElementBukuTidakSelesai) {
    const selesai = listElementBukuSelesai.querySelector('.card-404');
    const tidakSelesai = listElementBukuTidakSelesai.querySelector('.card-404');
    const isAvailableCompleted = items.some(buku => buku.isComplete);
    const isAvailableTidakCompleted = items.some(buku => !buku.isComplete)

    if( !isAvailableCompleted ) {
        selesai.classList.remove('hidden');
    } else {
        selesai.classList.add('hidden');
    }

    if( !isAvailableTidakCompleted ) {
        tidakSelesai.classList.remove('hidden');
    } else {
        tidakSelesai.classList.add('hidden');
    }
};

function rendering() {
    hapusElementBuku();
    const items = (itemBukuFilter || bukuItems);
    const listBukuElementCompleted = document.querySelector('#sudahSelesai');
    const listBukuElementTidakCompleted = document.querySelector('#tidakSelesai');

    apakahListKosong(items, listBukuElementCompleted, listBukuElementTidakCompleted);

    items.forEach((buku) => {
        const elementBuku = document.createElement('article');
        elementBuku.classList.add('card');
        elementBuku.id = buku.id;
        elementBuku.innerHTML = `
            <div>
                <h3>${buku.title}</h3>
                <p class="mb_1">Author: ${buku.author} | Year: ${buku.year}</p>
            </div>
            <div>
                <button class="button buttonEdit" onclick="perbaharuiBuku(${buku.id})">Edit</button>
                <button class="button buttonHapus" onclick="hapusBuku(${buku.id})">Hapus</button>
                <button class="button buttonMove" onclick="pindahkanBuku(${buku.id})">Buku ${buku.isComplete ? 'Belum' : 'Sudah'} Selesai</button>
            </div>
        `;

        // Logik
        if ( buku.isComplete ) {
            listBukuElementCompleted.append(elementBuku);
        } else {
            listBukuElementTidakCompleted.append(elementBuku);
        }
    });
}