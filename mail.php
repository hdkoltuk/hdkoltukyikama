<?php
// Formdan gelen veriler
$adsoyad = $_POST['ad'] ?? '';
$telefon = $_POST['telefon'] ?? '';
$email   = $_POST['email'] ?? '';
$hizmet  = $_POST['hizmet'] ?? '';
$not     = $_POST['not'] ?? '';
$tarih   = $_POST['tarih'] ?? date("Y-m-d");
$saat    = $_POST['saat'] ?? '';
$adet    = $_POST['adet'] ?? 1;

// Mail bilgileri
$to = "hakan.dilek.553455@gmail.com";
$subject = "Yeni Randevu Talebi - $adsoyad";
$message = "
<b>Ad Soyad:</b> $adsoyad <br>
<b>Telefon:</b> $telefon <br>
<b>E-posta:</b> $email <br>
<b>Hizmet:</b> $hizmet <br>
<b>Tarih/Saat:</b> $tarih $saat <br>
<b>Adet:</b> $adet <br>
<b>Not:</b> $not <br>
";

$headers  = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Randevu Sistemi <noreply@seninsiten.com>" . "\r\n";

// Mail gönder
@mail($to, $subject, $message, $headers);

// JSON’a kaydet
$store = _DIR_ . "/randevular.json";
$items = file_exists($store) ? json_decode(file_get_contents($store), true) : [];
$items[] = [
    "ad"=>$adsoyad, "telefon"=>$telefon, "email"=>$email,
    "hizmet"=>$hizmet, "not"=>$not, "tarih"=>$tarih,
    "saat"=>$saat, "adet"=>$adet, "createdAt"=>time()
];
file_put_contents($store, json_encode($items, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));

echo "OK";
?>