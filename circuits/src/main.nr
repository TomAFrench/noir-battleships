fn main(guess: pub u4, ship: u4, report_hit: pub u4) {
    // Noir doesn't allow boolean inputs so we treat 0 as a miss and 1 as a hit.
    constrain (report_hit == 0) | (report_hit == 1);
    let report_hit_flag = report_hit == 1;
    
    let hit = guess == ship;
    constrain report_hit_flag == hit;
}
