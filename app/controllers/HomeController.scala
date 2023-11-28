package controllers

import de.htwg.se.toybrokersludo.aview.TUI
import de.htwg.se.toybrokersludo.controller.Controller
import de.htwg.se.toybrokersludo.model.FieldBaseImpl.{Field, Matrix}
import de.htwg.se.toybrokersludo.model.FileIO.JsonImpl.FileIo
import de.htwg.se.toybrokersludo.model.{Stone, Token}
import play.api.libs.json.{JsValue, Json, Writes}
import play.api.mvc._
import javax.inject._

import akka.actor._
import play.api.libs.streams.ActorFlow
import scala.swing.Reactor


@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents, implicit val system: ActorSystem) extends BaseController {

  private val field = Field()
  private val fileIO = FileIo()
  private val controller = new Controller(field, fileIO)
  new TUI(controller)

  private val publisher = new ControllerPublisher()

  def game() = Action { implicit request: Request[AnyContent] =>
    val gameBoard = views.html.gameBoard(matrix = controller.getMatrix)
    val menu = views.html.menu()
    val dice = views.html.dice(dice = controller.getDice.toString)
    Ok(views.html.main(title = "Toy Brokers Ludo")
    (gameBoard = gameBoard)
    (menu = menu)
    (dice = dice)
    (snackbar = snackbar(controller)))
  }

  def welcome() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.welcome(start = "Toy Brokers Ludo"))
  }

  private def snackbar(controller: Controller): String = {
    controller.getPlayer.toString.concat(controller.getShouldDice match {
      case true => " have to dice"
      case false => " have to move"
    })
  }

  def dice() = Action { implicit request: Request[AnyContent] =>
    controller.getShouldDice match {
      case true => {
        controller.doAndPublish(controller.dice)
        publisher.push(event = new ReloadAll())
        Ok(Json.toJson(controller.getDice.toString))
      }
      case false => Conflict("Illegal state, player have to move")
    }
  }

  def reloadSnackbar() = Action { implicit request: Request[AnyContent] =>
    Ok(Json.toJson(
        controller.getPlayer.toString.concat(controller.getShouldDice match {
          case true => " have to dice"
          case false => " have to move"
        })
      ))
  }

  def reloadDice() = Action { implicit request: Request[AnyContent] =>
    Ok(Json.toJson(controller.getDice))
  }

  def reloadGame() = Action { implicit request: Request[AnyContent] =>
    Ok(Json.toJson(
      controller.getMatrix.getMap.map(list => list.map(stone =>
         stone.token match {
           case None =>
             Json.obj(
               "isAPlayField" -> stone.isAPlayField,
               "token" -> null,
               "index" -> stone.index
             )
           case Some(token: Token) =>
             Json.obj(
               "isAPlayField" -> stone.isAPlayField,
               "token" -> Json.obj(
                 "color" -> token.getColor(),
                 "number" -> token.getNumber(),
                 "index" -> stone.index
               )
             )
         }
      ))
    ))
  }

  def getPossibleMoves() = Action { implicit request: Request[AnyContent] =>
    Json.toJson(controller.getTargets())
    controller.getShouldDice match {
      case true => Conflict("Illegal state, player have to dice")
      case false => Ok(Json.toJson(controller.getPossibleMoves(controller.getDice).map( move =>
        move.token.toString
      )))
    }
  }

  def move(index: Int) = Action { implicit request: Request[AnyContent] =>
    if (controller.getShouldDice) {
      Conflict("Illegal state, player have to dice")
    }
    controller.getPossibleMoves(controller.getDice).lift(index) match {
      case Some(move) =>
        controller.doAndPublish(controller.move, move)
        publisher.push(event = new ReloadGame)
        publisher.push(event = new ReloadDice)
        Ok(Json.toJson(move.toString))
      case None => Conflict("Illegal move index")
    }
  }

  def undo() = Action { implicit request: Request[AnyContent] =>
    controller.doAndPublish(controller.undo)
    publisher.push(event = new ReloadAll)
    Ok(Json.toJson("success"))
  }

  def redo() = Action { implicit request: Request[AnyContent] =>
    controller.doAndPublish(controller.redo)
    publisher.push(event = new ReloadAll)
    Ok(Json.toJson("success"))
  }

  def save(path: String) = Action { implicit request: Request[AnyContent] =>
    controller.save(path)
    publisher.push(event = new ReloadAll)
    Ok(Json.toJson("success"))
  }

  def getSaveGames() = Action { implicit request: Request[AnyContent] =>
    Ok(Json.toJson(controller.getTargets()))
  }

  def load(path: String) = Action { implicit request: Request[AnyContent] =>
    controller.load(path)
    publisher.push(event = new ReloadAll)
    Ok(Json.toJson("success"))
  }

  def socket = WebSocket.accept[String, String] { request: RequestHeader =>
    println(request)
    ActorFlow.actorRef(out => ActorFactory.create(out))
  }

  object ActorFactory {
    def create(out: ActorRef) = {
      Props(new MyActor(out))
    }
  }

  class MyActor(out: ActorRef) extends Actor with Reactor {
    listenTo(publisher)
    def receive = {
      case msg: String =>
        out ! ("I received your message: " + msg)
    }

    reactions += {
      case event: ReloadAll => out ! ("reloadAll")
      case event: ReloadGame => out ! ("reloadGame")
      case event: ReloadDice => out ! ("reloadDice")
      case event: ReloadSnackbar => out ! ("reloadSnackbar")
    }
  }
}





