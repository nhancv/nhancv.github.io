angular.module('app.models', [])

    .constant("menu", {
        sodo: {
            contact: {
                title: "Số đỏ",
                link: 'https://www.foody.vn/ho-chi-minh/so-do-cafe-tra-sua-truong-chinh',
                address: '558 Trường Chinh, P. 13,  Quận Tân Bình, TP. HCM',
                openTime: '08:00 - 22:00',
                phone: '0966 718 221'
            },
            details:
                [
                    {
                        name: 'Trà sữa thập cẩm',
                        price: 20
                    },
                    {
                        name: 'Trà sữa thập cẩm & bánh flan trứng',
                        price: 28
                    },
                    {
                        name: 'Trà sữa bánh flan trứng',
                        price: 23
                    },
                    {
                        name: 'Trà sữa thạch phomai',
                        price: 20
                    },
                    {
                        name: 'Trà sữa củ năng',
                        price: 20
                    },
                    {
                        name: 'Trà sữa thạch dừa',
                        price: 20
                    },
                    {
                        name: 'Trà sữa thạch socola',
                        price: 20
                    },
                    {
                        name: 'Trà sữa trái cây',
                        price: 20
                    },
                    {
                        name: 'Trà sữa trân châu',
                        price: 20
                    },
                    {
                        name: 'Trà đào',
                        price: 20
                    },
                    {
                        name: 'Trà sữa thạch khoai môn',
                        price: 20
                    },
                    {
                        name: 'Trà sữa thạch sương sáo',
                        price: 20
                    },
                    {
                        name: 'Trà sữa thạch củ sen',
                        price: 20
                    },
                    {
                        name: 'Trà sữa thạch phô mai viên',
                        price: 30
                    },
                    {
                        name: 'Trà sữa thạch ngọc trai',
                        price: 25
                    },
                    {
                        name: 'Trà vải',
                        price: 20
                    },
                    {
                        name: 'Hồng trà tắc',
                        price: 12
                    },
                    {
                        name: 'Hồng trà',
                        price: 10
                    },
                    {
                        name: 'Hồng trà thập cẩm',
                        price: 20
                    },
                    {
                        name: 'Hồng trà thập cẩm bánh flan',
                        price: 28
                    },
                    {
                        name: 'Lục trà bánh flan',
                        price: 18
                    }
                ]
        },
        suongsao: {
            contact: {
                title: "Sương sáo",
                link: 'https://www.deliverynow.vn/ho-chi-minh/suong-sao-sua-shop-online',
                address: '91/34 Nguyễn Hồng Đào, P. 14, Quận Tân Bình, TP. HCM',
                openTime: '07:30 - 20:00',
                phone: '---'
            },
            details:
                [
                    {
                        name: 'Sữa chua nếp cẩm',
                        price: 25
                    },
                    {
                        name: 'Flan Quy Linh',
                        price: 25
                    },
                    {
                        name: 'Flan Quy Linh - Flan',
                        price: 30
                    },
                    {
                        name: 'Flan Quy Linh - Quy Linh',
                        price: 30
                    },
                    {
                        name: 'Flan Quy Linh - Flan + Quy Linh',
                        price: 35
                    },
                    {
                        name: 'Sương sáo đào',
                        price: 25
                    },
                    {
                        name: 'Sương sáo trái vải',
                        price: 25
                    },
                    {
                        name: 'Sương sáo sữa & cafe',
                        price: 20
                    },
                    {
                        name: 'Sương sáo sữa',
                        price: 20
                    },
                    {
                        name: 'Sương sáo hột é',
                        price: 15
                    }
                ]
        },
        towndeli: {
            contact: {
                title: "TOWN-DELI",
                link: 'https://towndeli.vn/menu',
                address: '---',
                openTime: '---',
                phone: '---'
            },
            details:
                [
                    {
                        name: 'CAFÉ SỮA ĐÁ - M',
                        price: 29
                    },
                    {
                        name: 'CAFÉ SỮA ĐÁ - L',
                        price: 35
                    },
                    {
                        name: 'ĐEN ĐÁ MACCHIATO - M',
                        price: 34
                    },
                    {
                        name: 'ĐEN ĐÁ MACCHIATO - L',
                        price: 39
                    },
                    {
                        name: 'CAFÉ MACCHIATO - M',
                        price: 36
                    },
                    {
                        name: 'CAFÉ MACCHIATO - L',
                        price: 42
                    },
                    {
                        name: 'CAFÉ MOCHA - M',
                        price: 36
                    },
                    {
                        name: 'CAFÉ MOCHA - L',
                        price: 42
                    },
                    {
                        name: 'CAFÉ LATTE - M',
                        price: 36
                    },
                    {
                        name: 'CAFÉ LATTE - L',
                        price: 42
                    },
                    {
                        name: 'CAFÉ TOWNDELI - M',
                        price: 38
                    },
                    {
                        name: 'CAFÉ TOWNDELI - L',
                        price: 44
                    },
                    {
                        name: 'CAFÉ ĐEN ĐÁ - M',
                        price: 27
                    },
                    {
                        name: 'CAFÉ ĐEN ĐÁ - L',
                        price: 33
                    },
                    {
                        name: 'HỒNG TRÀ TRÂN CHÂU - M',
                        price: 32
                    },
                    {
                        name: 'HỒNG TRÀ TRÂN CHÂU - L',
                        price: 37
                    },
                    {
                        name: 'HỒNG TRÀ TRÂN CHÂU TRẮNG - M',
                        price: 36
                    },
                    {
                        name: 'HỒNG TRÀ TRÂN CHÂU TRẮNG - L',
                        price: 41
                    },
                    {
                        name: 'HỒNG TRÀ THẠCH - M',
                        price: 32
                    },
                    {
                        name: 'HỒNG TRÀ THẠCH - L',
                        price: 37
                    },
                    {
                        name: 'HỒNG TRÀ THẠCH TRẮNG - M',
                        price: 36
                    },
                    {
                        name: 'HỒNG TRÀ THẠCH TRẮNG - L',
                        price: 41
                    },
                    {
                        name: 'TRÀ BẠC HÀ - M',
                        price: 34
                    },
                    {
                        name: 'TRÀ BẠC HÀ - L',
                        price: 39
                    },
                    {
                        name: 'TRÀ CHANH DÂY - M',
                        price: 34
                    },
                    {
                        name: 'TRÀ CHANH DÂY - L',
                        price: 39
                    },
                    {
                        name: 'TRÀ PHÚC BỒN TỬ (RASPBERRY) - M',
                        price: 35
                    },
                    {
                        name: 'TRÀ PHÚC BỒN TỬ (RASPBERRY) - L',
                        price: 41
                    },
                    {
                        name: 'TRÀ VIỆT QUẤT (BLUEBERRY) - M',
                        price: 35
                    },
                    {
                        name: 'TRÀ VIỆT QUẤT (BLUEBERRY) - L',
                        price: 41
                    },
                    {
                        name: 'TRÀ DÂU - M',
                        price: 36
                    },
                    {
                        name: 'TRÀ DÂU - L',
                        price: 42
                    },
                    {
                        name: 'TRÀ TÁO - M',
                        price: 36
                    },
                    {
                        name: 'TRÀ TÁO - L',
                        price: 42
                    },
                    {
                        name: 'TRÀ ĐÀO - M',
                        price: 36
                    },
                    {
                        name: 'TRÀ ĐÀO - L',
                        price: 42
                    },
                    {
                        name: 'TRÀ VẢI - M',
                        price: 36
                    },
                    {
                        name: 'TRÀ VẢI - L',
                        price: 42
                    },
                    {
                        name: 'TRÀ KIWI - M',
                        price: 36
                    },
                    {
                        name: 'TRÀ KIWI - L',
                        price: 42
                    },
                    {
                        name: 'TRÀ OOLONG MACCHIATO - M',
                        price: 35
                    },
                    {
                        name: 'TRÀ OOLONG MACCHIATO - L',
                        price: 41
                    },
                    {
                        name: 'TRÀ SỮA OOLONG TRÂN CHÂU - M',
                        price: 35
                    },
                    {
                        name: 'TRÀ SỮA OOLONG TRÂN CHÂU - L',
                        price: 41
                    },
                    {
                        name: 'TRÀ SỮA OOLONG TRÂN CHÂU TRẮNG - M',
                        price: 39
                    },
                    {
                        name: 'TRÀ SỮA OOLONG TRÂN CHÂU TRẮNG - L',
                        price: 45
                    },
                    {
                        name: 'TRÀ SỮA OOLONG BÁNH FLAN - M',
                        price: 35
                    },
                    {
                        name: 'TRÀ SỮA OOLONG BÁNH FLAN - L',
                        price: 41
                    },
                    {
                        name: 'TRÀ SỮA OOLONG THẠCH - M',
                        price: 35
                    },
                    {
                        name: 'TRÀ SỮA OOLONG THẠCH - L',
                        price: 41
                    },
                    {
                        name: 'TRÀ SỮA OOLONG THẠCH TRẮNG - M',
                        price: 39
                    },
                    {
                        name: 'TRÀ SỮA OOLONG THẠCH TRẮNG - L',
                        price: 45
                    },
                    {
                        name: 'TRÀ SỮA OOLONG ĐẬU ĐỎ - M',
                        price: 39
                    },
                    {
                        name: 'TRÀ SỮA OOLONG ĐẬU ĐỎ - L',
                        price: 45
                    },
                    {
                        name: 'TRÀ SỮA OOLONG CHOCOLATE - M',
                        price: 35
                    },
                    {
                        name: 'TRÀ SỮA OOLONG CHOCOLATE - L',
                        price: 41
                    },
                    {
                        name: 'TRÀ SỮA OOLONG CARAMEL - M',
                        price: 36
                    },
                    {
                        name: 'TRÀ SỮA OOLONG CARAMEL - L',
                        price: 42
                    },
                    {
                        name: 'TRÀ SỮA OOLONG BẠC HÀ - M',
                        price: 36
                    },
                    {
                        name: 'TRÀ SỮA OOLONG BẠC HÀ - L',
                        price: 42
                    },
                    {
                        name: 'TRÀ SỮA OOLONG HƯƠNG VỊ TRÁI CÂY - M',
                        price: 36
                    },
                    {
                        name: 'TRÀ SỮA OOLONG HƯƠNG VỊ TRÁI CÂY - L',
                        price: 42
                    },
                    {
                        name: 'MATCHA LATTE - M',
                        price: 38
                    },
                    {
                        name: 'MATCHA LATTE - L',
                        price: 44
                    },
                    {
                        name: 'MATCHA LATTE & ĐẬU ĐỎ - M',
                        price: 48
                    },
                    {
                        name: 'MATCHA LATTE & ĐẬU ĐỎ - L',
                        price: 54
                    },
                    {
                        name: 'TRÀ SỮA TOWNDELI - M',
                        price: 36
                    },
                    {
                        name: 'TRÀ SỮA TOWNDELI - L',
                        price: 42
                    },
                    {
                        name: 'YOSHAKE CHANH DÂY - M',
                        price: 35
                    },
                    {
                        name: 'YOSHAKE CHANH DÂY - L',
                        price: 41
                    },
                    {
                        name: 'YOSHAKE NHA ĐAM & CAM - M',
                        price: 35
                    },
                    {
                        name: 'YOSHAKE NHA ĐAM & CAM - L',
                        price: 41
                    },
                    {
                        name: 'YOSHAKE XOÀI & DỨA - M',
                        price: 35
                    },
                    {
                        name: 'YOSHAKE XOÀI & DỨA - L',
                        price: 41
                    },
                    {
                        name: 'YOSHAKE NHO ĐEN - M',
                        price: 36
                    },
                    {
                        name: 'YOSHAKE NHO ĐEN - L',
                        price: 42
                    },
                    {
                        name: 'YOSHAKE PHÚC BỒN TỬ (RASPBERRY) - M',
                        price: 36
                    },
                    {
                        name: 'YOSHAKE PHÚC BỒN TỬ (RASPBERRY) - L',
                        price: 42
                    },
                    {
                        name: 'YOSHAKE VIỆT QUẤT (BLUEBERRY) - M',
                        price: 36
                    },
                    {
                        name: 'YOSHAKE VIỆT QUẤT (BLUEBERRY) - L',
                        price: 42
                    },
                    {
                        name: 'YOSHAKE KIWI - M',
                        price: 38
                    },
                    {
                        name: 'YOSHAKE KIWI - L',
                        price: 44
                    },
                    {
                        name: 'YOSHAKE ĐÀO - M',
                        price: 38
                    },
                    {
                        name: 'YOSHAKE ĐÀO - L',
                        price: 44
                    },
                    {
                        name: 'YOSHAKE MAKE-YOUR-OWN - M',
                        price: 38
                    },
                    {
                        name: 'YOSHAKE MAKE-YOUR-OWN - L',
                        price: 44
                    },
                    {
                        name: 'CHOCOLATE MACCHIATO - M',
                        price: 36
                    },
                    {
                        name: 'CHOCOLATE MACCHIATO - L',
                        price: 42
                    },
                    {
                        name: 'CHOCOLATE BẠC HÀ MACCHIATO - M',
                        price: 38
                    },
                    {
                        name: 'CHOCOLATE BẠC HÀ MACCHIATO - L',
                        price: 44
                    },
                    {
                        name: 'CHOCOLATE CARAMEL MACCHIATO - M',
                        price: 38
                    },
                    {
                        name: 'CHOCOLATE CARAMEL MACCHIATO - L',
                        price: 44
                    }
                ]
        }
    })

;